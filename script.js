var timer;
var timeLeft=25*60;
function setPreset(minutes) {
    document.getElementById("focusMinutes").value = minutes;
    timeLeft = minutes * 60;
    updateTime(); // update display
}
function startTimer(){
    clearInterval(timer)
    timer=setInterval(()=>{
        if(timeLeft<=0){
            clearInterval(timer);
            document.getElementById("timer").textContent="Time's Up";
            document.getElementById("alarm-sound").play();
            return;
        }
        timeLeft--;
        updateTime();
    },1000);
}
function resetTimer(){
    clearInterval(timer);
    timeLeft=25*60;
    updateTime();

    localStorage.removeItem("focusModeActive");
}
function updateTime(){
    const minutes=Math.floor(timeLeft/60);
    const seconds=timeLeft%60;

    var temp=(minutes<10?'0':'')+minutes+':'+(seconds<10?'0':'')+seconds;
    document.getElementById("timer").textContent=temp;
}
function updateInitialDisplay() {
    var minutes = parseInt(document.getElementById("focusMinutes").value);
    if (isNaN(minutes) || minutes <= 0) {
        document.getElementById("timer").textContent = "00:00";
        return;
    }
    timeLeft = minutes * 60;
    updateTime();  // Reuse your existing logic
}
function addCustomLink() {
  var name = document.getElementById("link-name").value.trim();
  var url = document.getElementById("link-url").value.trim();

  if (name === "" || url === "") {
    alert("Please enter both a name and URL.");
    return;
  }
   const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];
  links.push({ name, url });
  localStorage.setItem("customProductiveLinks", JSON.stringify(links));
  displayCustomLinks();
  

  // var list = document.getElementById("custom-links");
  // var li = document.createElement("li");
  // var a = document.createElement("a");
  // a.href = url;
  // a.target = "_blank";
  // a.textContent = "🔗 " + name;
  // var del = document.createElement("button");
  // del.textContent = "Delete";
  // del.className = "delete-btn";
  // del.onclick = function () {
  //   li.remove();
  //    const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];
  // const updatedLinks = links.filter(link => !(link.name === name && link.url === url));
  // localStorage.setItem("customProductiveLinks", JSON.stringify(updatedLinks));
  // };

  // li.appendChild(a);
  // li.appendChild(del);
  // list.appendChild(li);

  // Clear input fields
  document.getElementById("link-name").value = "";
  document.getElementById("link-url").value = "";
  // const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];
  // links.push({ name, url });
  // localStorage.setItem("customProductiveLinks", JSON.stringify(links));
  // displayCustomLinks();
}
// displaycustomLinks()
function displayCustomLinks() {
  const list = document.getElementById("custom-links");
  list.innerHTML = ""; // Clear previous list

  const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];

  links.forEach((link, index) => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank"; // open in new tab
    a.textContent = `🔗 ${link.name}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.className = "btn secondary";
    deleteBtn.onclick = function () {
      deleteCustomLink(index);
    };

    li.appendChild(a);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function deleteCustomLink(index) {
  const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];
  links.splice(index, 1); // remove 1 item at the given index
  localStorage.setItem("customProductiveLinks", JSON.stringify(links));
  displayCustomLinks(); // re-render updated list
}




// 
window.onload = function () {
  displayCustomLinks();
  displayBlockedSites();
};

function startFocusMode() {
  // 1. Alert the user
  alert("Focus Mode Activated and timer has started!!!");

  // 2. Scroll to the Tools section
  document.querySelector(".tools-section").scrollIntoView({ behavior: "smooth" });

  // 3. Start the timer
  startTimer();

  // 4. Open all productive links in new tabs
  // const defaultLinks = [
   
  //   { name: "Leetcode", url: "https://leetcode.com/" }
  // ];

  const customLinks = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];
  const allLinks = customLinks;

  allLinks.forEach(link => {
    window.open(link.url, "_blank");
  });
  localStorage.setItem("focusModeActive", "true");
}

//Blocked Sites functionality
function addBlockedSite() {
  //  alert("Blocked site button clicked!");
  const name = document.getElementById("blocked-name").value.trim();
  const url = document.getElementById("blocked-url").value.trim();

  if (!name || !url) return alert("Please enter both name and URL");

  const blocked = JSON.parse(localStorage.getItem("customBlockedSites")) || [];
  blocked.push({ name, url });
  localStorage.setItem("customBlockedSites", JSON.stringify(blocked));
  displayBlockedSites();

  document.getElementById("blocked-name").value = "";
  document.getElementById("blocked-url").value = "";
}

function displayBlockedSites() {
  const list = document.getElementById("custom-blocked");
  list.innerHTML = "";

  const blocked = JSON.parse(localStorage.getItem("customBlockedSites")) || [];

  blocked.forEach((site, index) => {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = `❌ ${site.name}`;
    label.style.cursor = "pointer";

    // 🟡 Show alert on hover
    label.addEventListener("mouseenter", function () {
      alert(`You marked ${site.name} as a distraction. Stay focused! 🚫`);
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
     del.style.marginLeft = "10px";
    del.className = "btn secondary";
    del.onclick = function () {
      const updated = blocked.filter((_, i) => i !== index);
      localStorage.setItem("customBlockedSites", JSON.stringify(updated));
      displayBlockedSites();
    };

    li.appendChild(label);
    li.appendChild(del);
    list.appendChild(li);
  });
}
// window.onload = function () {
//   displayBlockedSites(); // Add this
// }
document.addEventListener("visibilitychange", function () {
  const isFocusMode = localStorage.getItem("focusModeActive") === "true";

  if (document.hidden && isFocusMode) {
    console.log("User left the tab");
  } else if (!document.hidden && isFocusMode) {
    // Gentle reminder when user comes back
    alert("🚨 You're in Focus Mode. Stay on task! 🧘‍♀️");
  }
});

