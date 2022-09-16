let addFlag = "false";
let removeflag = "false";
let lockclass = "fa-lock";
let unlockclass = "fa-lock-open";
let addBtn = document.querySelector(".add");
let textareaCont = document.querySelector(".mtext"); // text wala
let modalCont = document.querySelector(".mbody"); // modal wala
let mainCont = document.querySelector(".dbody"); //main cont
let lockelem = document.querySelector(".status");
let removeBtn = document.querySelector(".remove");
let allPriorityColors = document.querySelectorAll(".boxes"); //ALLprioritycolors 
let colors = ["greenP", "blueP", "redP", "brownP"];
let toolboxcolor = document.querySelectorAll(".color");
let modalPriorityColor = colors[colors.length - 1];// allprioritycolor
let ticketArr = [];



// see......add, remove, lock, browser storage all these things are working well 
// but , filter color at nav bar , color change , isnt working well
// ab hm check kr rhe h ki phle se hi kuch h ya nahi storage me agr h to usse use kro and nahi h to starting se code run hoga and new banega sab kuch
if (localStorage.getItem("Ticket_Manager")) {
    ticketArr = JSON.parse(localStorage.getItem("Ticket_Manager"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.tcolor, ticketObj.ttask, ticketObj.tid);
    })
}


// ticketObj kya h ye
// listener for modal priority coloring
// ticket cont kya h  mamainbox

for (let i = 0; i < toolboxcolor.length; i++) {
    toolboxcolor[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolboxcolor[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.tcolor;
        })

        // remove previous tickets 
        let allTicketcont = document.querySelectorAll(".mainbox");
        for (let i = 0; i < allTicketcont.length; i++) {
            // const element = array[i];
            allTicketcont[i].remove();
        }

        // display filtered tickets 
        filteredTickets.forEach((ticketObj, idx) => {
            createElement(ticketObj.tcolor, ticketObj.ttask, ticketObj.tid);
        })
    })
    toolboxcolor[i].addEventListener("dblclick", (e) => {
        let allTicketcont = document.querySelectorAll(".mainbox");
        for (let i = 0; i < allTicketcont.length; i++) {
            // const element = array[i];
            allTicketcont[i].remove();
        }
        ticketArr.forEach((ticketObj, idx) => {
            createElement(ticketObj.tcolor, ticketObj.ttask, ticketObj.tid);
        })
    })
}

allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((colorslist, idx) => {
            colorslist.classList.remove("border");
        });
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    });
});

// modal cont = newAct
// textareacont = mtext

// this is simple this do the work  : when + is clicked 
// it toggle the addFlag and then if it is true
//  then display is flex otherwise it is none 
addBtn.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    } else
        modalCont.style.display = "none";
});

removeBtn.addEventListener("click", (e) => {
    removeflag = !removeflag;
    // if remove is clicked then it becomes true and goes in if so delete it from here
    // handleremoval();

});

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textareaCont.value);
        addFlag = false;
        setModaltoDefault();
    }
});


function createTicket(tcolor, ttask, tid) {
    let id = tid || shortid();
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class", "mainbox");
    ticketcont.innerHTML = `
    <div class="band ${tcolor}"></div>
    <div class="taskid">#${id}</div>
    <div class="tasktext">${ttask}</div>
    <div class="status"><i class="fas fa-lock"></i></div>`;
    mainCont.appendChild(ticketcont);


    // create object of ticket and add to array;
    if (!tid) {
        ticketArr.push({ tcolor, ttask, tid: id });
        localStorage.setItem("Ticket_Manager", JSON.stringify(ticketArr)); // stringify se data string ki format me convert ho jayega 
    }
    removeflag = !removeflag;
    handleremoval(ticketcont, id);
    handlelock(ticketcont, id);
    handleColor(ticketcont, id);
}

function handleremoval(ticket, id) { // remove the ticket
    removeflag = false;
    ticket.addEventListener("click", (e) => {
        if (!removeflag) { return; }
        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1);
        let strTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem("Ticket_Manager", strTicketArr);
        ticket.remove(); //ui removal 
    })
}

function handlelock(ticket, id) {
    let lockelement = ticket.querySelector(".status");
    let ticketLock = lockelement.children[0];
    let tickettaskarea = ticket.querySelector(".tasktext");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        if (ticketLock.classList.contains(lockclass)) {
            ticketLock.classList.remove(lockclass);
            ticketLock.classList.add(unlockclass);
            tickettaskarea.setAttribute("contenteditable", "true");
        }
        else {
            ticketLock.classList.remove(unlockclass);
            ticketLock.classList.add(lockclass);
            tickettaskarea.setAttribute("contenteditable", "false");
        }
        // modify in Storage
        ticketArr[ticketIdx].ttask = tickettaskarea.innerText;
        localStorage.setItem("Ticket_Manager", JSON.stringify(ticketArr));
    });
}

function handleColor(ticket, id) {
    let ticketcolor = ticket.querySelector(".band");
    ticketcolor.addEventListener("click", (e) => {
        // get ticket index from array 
        let ticketIdx = getTicketIdx(id);
        let currticket = ticketcolor.classList[1];
        let currticketIndex = colors.findIndex((color) => {
            return currticket === color;
        })
        currticketIndex++;
        let newTicketColorIdx = currticketIndex % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketcolor.classList.remove(currticket);
        ticketcolor.classList.add(newTicketColor);

        // modifying data in local storage 
        ticketArr[ticketIdx].ticketcolor = newTicketColor;
        localStorage.setItem("Ticket_Manager", JSON.stringify(ticketArr));
    })
}

function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.tid === id;
    })
    return ticketIdx;
}

function setModaltoDefault() {
    modalCont.style.display = "none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allPriorityColors.forEach((colorslist, idx) => {
        colorslist.classList.remove("border");
    });
    allPriorityColors[allPriorityColors.length - 1].classList.add("border");
}

