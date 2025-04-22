
let wallets = {
  "0xABCDEF123456": { balance: 1000, history: [] }
};

let currentWallet = "";

function generateAddress() {
  return "0x" + Math.random().toString(16).substr(2, 8).toUpperCase();
}

function showSend() {
  document.getElementById("send-section").classList.remove("hidden");
  document.getElementById("receive-section").classList.add("hidden");
}

function showReceive() {
  document.getElementById("receive-section").classList.remove("hidden");
  document.getElementById("send-section").classList.add("hidden");
}

function sendUSDT() {
  const to = document.getElementById("send-to").value;
  const amt = parseFloat(document.getElementById("send-amount").value);
  if (!wallets[to]) {
    wallets[to] = { balance: 0, history: [] };
  }

  if (wallets[currentWallet].balance >= amt) {
    wallets[currentWallet].balance -= amt;
    wallets[to].balance += amt;

    const tx = {
      from: currentWallet,
      to: to,
      amount: amt,
      time: new Date().toLocaleString()
    };

    wallets[currentWallet].history.unshift({ ...tx, type: "sent" });
    wallets[to].history.unshift({ ...tx, type: "received" });

    updateWallet();
  } else {
    alert("Insufficient Balance");
  }

  document.getElementById("send-to").value = "";
  document.getElementById("send-amount").value = "";
}

function renderQR(address) {
  const qr = new QRious({
    element: document.getElementById("qrCanvas"),
    value: address,
    size: 180
  });
}

function renderHistory() {
  const history = wallets[currentWallet].history;
  const ul = document.getElementById("history");
  ul.innerHTML = "";
  history.forEach(tx => {
    const li = document.createElement("li");
    li.textContent = `${tx.type === "sent" ? "Sent" : "Received"} ${tx.amount} USDT ${tx.type === "sent" ? "to" : "from"} ${tx.type === "sent" ? tx.to : tx.from} on ${tx.time}`;
    ul.appendChild(li);
  });
}

function updateWallet() {
  document.getElementById("balance").innerText = wallets[currentWallet].balance.toFixed(2);
  renderQR(currentWallet);
  renderHistory();
}

window.onload = () => {
  currentWallet = generateAddress();
  wallets[currentWallet] = { balance: 1000, history: [] };
  document.getElementById("wallet-address").innerText = currentWallet;
  updateWallet();
};
