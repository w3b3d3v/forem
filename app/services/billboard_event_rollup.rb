class BillboardEventRollup
  ATTRIBUTES_PRESERVED = %i[user_id display_ad_id category context_type created_at].freeze
  ATTRIBUTES_DESTROYED = %i[id counts_for updated_at article_id geolocation].freeze
  STATEMENT_TIMEOUT = ENV.fetch("STATEMENT_TIMEOUT_BULK_DELETE", 10_000).to_i.seconds / 1_000.to_f

  class EventAggregator
    Compact = Struct.new(:events, :user_id, :billboard_id, :category, :context_type) do
      def to_h
        super.except(:events).merge({ counts_for: events.sum(&:counts_for) })
      end
    end

    def initialize
      @aggregator = Hash.new do |level1, user_id|
        level1[user_id] = Hash.new do |level2, billboard_id|
          level2[billboard_id] = Hash.new do |level3, category|
            level3[category] = Hash.new do |level4, context_type|
              level4[context_type] = []
            end
          end
        end
      end
    end

    def <<(event)
      @aggregator[event.user_id][event.billboard_id][event.category][event.context_type] << event
    end

    def each
      @aggregator.each_pair do |user_id, grouped_by_user_id|
        grouped_by_user_id.each_pair do |billboard_id, grouped_by_billboard_id|
          grouped_by_billboard_id.each_pair do |category, grouped_by_category|
            grouped_by_category.each_pair do |context_type, events|
              next unless events.size > 1

              yield Compact.new(events, user_id, billboard_id, category, context_type)
            end
          end
        end
      end
    end

    private

    attr_reader :aggregator
  end

  def self.rollup(date, relation: BillboardEvent)
    new(relation: relation).rollup(date)
  end

  def initialize(relation:)
    @aggregator = EventAggregator.new
    @relation = relation
  end

  attr_reader :aggregator, :relation

  def rollup(date, batch_size: 1000)
    created = []

    # Ensure SET LOCAL is done within a transaction block
    relation.transaction do
      relation.connection.execute("SET LOCAL statement_timeout = '#{STATEMENT_TIMEOUT}s'") # Set temp timeout

      relation.where(created_at: date.all_day).in_batches(of: batch_size) do |rows_batch|
        aggregate_into_groups(rows_batch).each do |compacted_events|
          created << compact_records(date, compacted_events)
        end
      end
    end

    created
  ensure
    relation.connection.execute("RESET statement_timeout") # Reset after fetching batches
  end

  private

  def aggregate_into_groups(rows)
    # SET LOCAL inside transaction
    relation.transaction do
      relation.connection.execute("SET LOCAL statement_timeout = '#{STATEMENT_TIMEOUT}s'") # Set temp timeout

      rows.in_batches.each_record do |event|
        aggregator << event
      end
    end

    aggregator
  ensure
    relation.connection.execute("RESET statement_timeout") # Reset after aggregation
  end

  def compact_records(date, compacted)
    result = nil

    relation.transaction do
      relation.connection.execute("SET LOCAL statement_timeout = '#{STATEMENT_TIMEOUT}s'") # Set temp timeout
      result = relation.create!(compacted.to_h) do |event|
        event.created_at = date
      end

      relation.where(id: compacted.events).delete_all
    end

    result
  ensure
    relation.connection.execute("RESET statement_timeout") # Reset to the default timeout
  end
end
