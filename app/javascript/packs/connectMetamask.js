document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('connect-mm-button').onclick = async function () {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    window.account = accounts[0]; // endereço da metamask do usuário
  };
});
