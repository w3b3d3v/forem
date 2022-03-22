document.addEventListener('DOMContentLoaded', () => {
  const metamask = document.querySelectorAll('.connect-mm-button');
  const deleteWallet = document.querySelector('.mm-delete-button');
  const button = document.querySelector('.mm-connect-button');

  [].forEach.call(metamask, (div) => {
    div.onclick = async function () {
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
          const span = document.querySelector('#wallet_addresses');
          const h2 = document.createElement('h2');
          h2.innerHTML = 'Carteiras:';
          span.appendChild(h2);
          span.innerHTML += data.address;
          button.style.display = 'none';
        });
    };
  });
  deleteWallet
    ? (deleteWallet.onclick = async function () {
        //window.ethereum.on('delete', (error) => error);
        await fetch('/users/delete_wallet', {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': window.csrfToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: deleteWallet.id,
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
            wallets.style.display = 'none';
          });
      })
    : null;
});
