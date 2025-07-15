
//ENTIRE TIMER LOGIC
var timer;
var timeLeft=25*60;

function setCustomTime() {
  const minutes = parseInt(document.getElementById("custom-minutes").value);

  if (isNaN(minutes) || minutes < 1 || minutes > 60) {
    alert("Please enter a valid number between 1 and 60.");
    return;
  }

  timeLeft = minutes * 60;
  updateTime(); // update display
  document.getElementById("custom-minutes").value = "";

}

//LOGIC FOR WHAT HAPPENS ON CLICKING START TIMER BUTTON
function startTimer(){
    clearInterval(timer);
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
//LLOGIC FOR WHAT HAPPENS ON CLICKING RESET TIMER BUTTON
function resetTimer(){
    clearInterval(timer);
    timeLeft=25*60;
    updateTime();
    localStorage.removeItem("focusModeActive");
}

//LOGIC AS HOW TIME GETS UPDATED ON SCREEN
function updateTime(){
    const minutes=Math.floor(timeLeft/60);
    const seconds=timeLeft%60;

    var temp=(minutes<10?'0':'')+minutes+':'+(seconds<10?'0':'')+seconds;
    document.getElementById("timer").textContent=temp;
}

//LOGIC FOR HOW TIME ENTERED BY USER DISPLAYS AS IN A TIMER
function updateInitialDisplay() {
    var minutes = parseInt(document.getElementById("focusMinutes").value);
    if (isNaN(minutes) || minutes <= 0) {
        document.getElementById("timer").textContent = "00:00";
        return;
    }
    timeLeft = minutes * 60;
    updateTime();  // Reuse your existing logic
}

//LOGIC FOR START FOCUS BUTTON
function startFocusMode() {
  // 1. Alert the user
  // alert("Focus Mode Activated and timer has started!!!");

  // 2. Scroll to the Tools section
  document.querySelector("#focus-timer").scrollIntoView({ behavior: "smooth" });

  // 3. Start the timer
  startTimer();
   alert("Focus Mode Activated and timer has started!!!");
  
  localStorage.setItem("focusModeActive", "true");
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
  // Clear input fields
  document.getElementById("link-name").value = "";
  document.getElementById("link-url").value = "";
 
}
// displaycustomLinks()
function displayCustomLinks() {
  const list = document.getElementById("custom-links");
  list.innerHTML = ""; // Clear previous list

  const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];

  links.forEach((link, index) => {
    const li = document.createElement("li");
     li.className = "mb-2 flex items-center justify-between"; 

    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank"; // open in new tab
    a.textContent = `🔗 ${link.name}`;
    a.className = "text-blue-600 font-medium hover:underline";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
     deleteBtn.className =
      "ml-4 text-red-500 hover:text-red-700 text-sm border border-red-400 px-2 py-1 rounded";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.className = "btn secondary";
    deleteBtn.onclick = function () {
      //  const updated = links.filter((_, i) => i !== index);
      // localStorage.setItem("customProductiveLinks", JSON.stringify(updated));
      deleteCustomLink(index);
    };

    li.appendChild(a);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
   document.getElementById("link-name").value = "";
  document.getElementById("link-url").value = "";

}

function deleteCustomLink(index) {
  const links = JSON.parse(localStorage.getItem("customProductiveLinks")) || [];
  links.splice(index, 1); // remove 1 item at the given index
  localStorage.setItem("customProductiveLinks", JSON.stringify(links));
  displayCustomLinks(); // re-render updated list
}
window.onload = function () {
  displayCustomLinks();
  displayBlockedSites();
};



//Blocked Sites functionality
function addBlockedSite() {
  //  alert("Blocked site button clicked!");
  const name = document.getElementById("block-site-name").value.trim();
  const url = document.getElementById("blocked-url").value.trim();

  if (!name || !url) return alert("Please enter both name and URL");

  const blocked = JSON.parse(localStorage.getItem("customBlockedSites")) || [];
  blocked.push({ name, url });
  localStorage.setItem("customBlockedSites", JSON.stringify(blocked));
  displayBlockedSites();

  document.getElementById("block-site-name").value = "";
  document.getElementById("blocked-url").value = "";
}

function displayBlockedSites() {
  const list = document.getElementById("custom-blocked-list");
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

