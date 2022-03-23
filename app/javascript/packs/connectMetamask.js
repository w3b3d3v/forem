document.addEventListener('DOMContentLoaded', () => {
  const connectButton = document.querySelector('.connect-wallet');
  const deleteButton = document.querySelector('.delete-wallet');
  const address = document.getElementById('wallet_address_paragraph');

  const metamask = document.querySelector('.connect-mm-button');

  metamask.addEventListener('click', () => connectWallet(connectButton));

  connectButton.addEventListener('click', () => connectWallet());

  deleteButton.addEventListener('click', () =>
    deleteWallet(address.innerText.trim()),
  );
});

const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  await window.ethereum.request({
    method: 'personal_sign',
    params: ['Login Web3', accounts[0]],
  });
  await fetch('/users/connect_wallet', {
    method: 'POST',
    headers: {
      'X-CSRF-Token': window.csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: accounts[0],
    }),
  })
    .then((res) => {
      if (!res.ok) return;
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      const connectButton = document.querySelector('.connect-wallet');
      const deleteButton = document.querySelector('.delete-wallet');
      const span = document.querySelector('#wallet_addresses');
      span.innerHTML = '';
      const h2 = document.createElement('h2');
      const p = document.createElement('p');
      p.setAttribute('id', 'wallet_address_paragraph');
      h2.innerHTML = 'Wallets:';
      span.appendChild(h2);
      p.innerHTML = data.address;
      span.appendChild(p);
      span.style.display = 'block';
      connectButton.style.display = 'none';
      deleteButton.style.display = 'block';
    });
};

const deleteWallet = async (address) => {
  await fetch('/users/delete_wallet', {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': window.csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
    }),
  })
    .then((res) => {
      if (!res.ok) return;
      return res.json();
    })
    .then((data) => {
      console.error(data);
      if (!data) return;
      const wallets = document.querySelector('#wallet_addresses');
      const connectButton = document.querySelector('.connect-wallet');
      const deleteButton = document.querySelector('.delete-wallet');
      wallets.style.display = 'none';
      deleteButton.style.display = 'none';
      connectButton.style.display = 'block';
    });
};
