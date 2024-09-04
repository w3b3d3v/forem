module FieldTest
  def self.config
    @config ||= YAML.safe_load(ERB.new(File.read(config_path)).result, permitted_classes: [Date, BigDecimal])
  end
end
