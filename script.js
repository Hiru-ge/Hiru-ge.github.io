const openGiftBtn = document.getElementById("openGiftBtn");
const codePanel = document.getElementById("codePanel");
const giftCodeEl = document.getElementById("giftCode");
const copyBtn = document.getElementById("copyBtn");
const statusMessage = document.getElementById("statusMessage");
const confettiLayer = document.getElementById("confettiLayer");
const redeemArea = document.getElementById("redeemArea");

let decodedGiftCode = "";

function readGiftCodeFromHash() {
  const rawHash = window.location.hash;

  if (!rawHash || rawHash.length <= 1) {
    return "";
  }

  try {
    return decodeURIComponent(rawHash.substring(1));
  } catch {
    return "";
  }
}

function renderGiftCodeSafely(code) {
  if (!giftCodeEl) {
    return;
  }

  // XSS対策として、文字列は textContent だけで描画する。
  giftCodeEl.textContent = code || "コードが見つかりません";
}

function setStatus(message, isError = false) {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#b42318" : "#1f8d4a";
}

function launchConfetti(count = 34) {
  if (!confettiLayer) {
    return;
  }

  const colors = ["#f97316", "#f59e0b", "#f43f5e", "#fb7185", "#eab308"];

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2 + Math.random() * 1.8}s`;
    piece.style.opacity = `${0.65 + Math.random() * 0.35}`;
    piece.style.transform = `translateY(-8vh) rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 4200);
  }
}

function showRedeemLink() {
  if (redeemArea) {
    redeemArea.hidden = false;
  }
}

async function copyGiftCode() {
  if (!decodedGiftCode) {
    setStatus("コピーできるコードがありません", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(decodedGiftCode);
    setStatus("コピー完了！そのまま貼り付けられるよ");
    showRedeemLink();
  } catch {
    // 古い環境向けのフォールバック。
    const temp = document.createElement("textarea");
    temp.value = decodedGiftCode;
    temp.setAttribute("readonly", "readonly");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();

    const succeeded = document.execCommand("copy");
    document.body.removeChild(temp);

    if (succeeded) {
      setStatus("コピー完了！そのまま貼り付けられるよ");
      showRedeemLink();
      return;
    }

    setStatus("コピーに失敗しました。手動でコピーしてください", true);
  }
}

function openGift() {
  if (!openGiftBtn || !codePanel) {
    return;
  }

  openGiftBtn.classList.add("opened");
  codePanel.hidden = false;
  launchConfetti();

  if (!decodedGiftCode) {
    setStatus("URLの # 以降にギフトコードを入れてください", true);
  } else {
    setStatus("ギフトコードを表示しました");
  }
}

function init() {
  decodedGiftCode = readGiftCodeFromHash();
  renderGiftCodeSafely(decodedGiftCode);

  if (openGiftBtn) {
    openGiftBtn.addEventListener("click", openGift);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copyGiftCode);
  }
}

init();
