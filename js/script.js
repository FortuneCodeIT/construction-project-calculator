// function getProjects() {
//     return;
//     JSON.parse(localStorage.getItem("projects")) || [];
// }
// function saveProject(data) {
//     localStorage.setItem("projects", JSON.stringify(data));
// }

// function getExpenses() {
//     return
//     JSON.parse(localStorage.getItem("expenses")) || [];
// }
// function saveProject(data) {
//     localStorage.setItem("expenses", JSON.stringify(data));
// }

// let expenses = getExpenses();
// let projects = getProjects();


let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
 
// let projects = JSON.parse(localStorage.getItem("projects")) || [];


document.addEventListener("DOMContentLoaded", () => {
     validateProjectForm();
     validateExpenseForm();
     renderProjectCards();
    populateProjectDropdown();
    updateDashboard();
    updateProjectTitle();
});


document.addEventListener("click", function (e) {

// this is to open add expenses input
   if (e.target.id === "btn-modal") {
    document.getElementById("modal").style.display = "block";
   }

// this opens the add project input
 if (e.target.id === "openProjectModal") {
    document.getElementById("projectModal").style.display = "block";
    
 }

 // for project page
 if (e.target.id === "closeProjectModal") {
     document.getElementById("projectModal").style.display = "none";

     const projectForm = document.getElementById("projectForm");
     const projectMsg = document.getElementById("projectMsg");

    if(projectMsg)  projectMsg.innerHTML = "";
     if (projectForm) projectForm.reset();
 }

});


function validateProjectForm() {

     const projectForm = document.getElementById("projectForm");
     if (!projectForm) return;

        const projectNameInput = document.getElementById("projectNameInput");
        const projectBudgetInput = document.getElementById("projectBudgetInput");
        const projectAddBtn = document.getElementById("projectAddBtn");
       
        const projectMsg = document.getElementById("projectMsg");

projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (projectNameInput.value === "" || projectBudgetInput.value === "" ) {
        projectMsg.innerHTML = "Please input all field"
        projectMsg.style.color = "red"
        return;
    }
    else if (Number(projectBudgetInput.value) < 5000) {
        projectMsg.innerHTML = "Budget must be 5000 and Above"
        projectMsg.style.color = "red"
        return;
    }

    let projects = JSON.parse(localStorage.getItem("projects")) || [];
projects.push(
    {
        // the id is to give every project a unique id even when the names are same it will treat each project as a special project
    id: Date.now(),
    projectName: projectNameInput.value.trim(),
    budget: Number(projectBudgetInput.value),
    spent: 0
})

localStorage.setItem("projects", JSON.stringify(projects));

renderProjectCards()
populateProjectDropdown();

 projectForm.reset();

        projectMsg.innerHTML = "Project Added Successfully"
        projectMsg.style.color = "green"
       

});
}

// this is for the project name dropdown for expenses
 function populateProjectDropdown() {
    
    const projectSelect = document.getElementById("projectSelect");

    if(!projectSelect) return;

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    projectSelect.innerHTML = "<option value=''>Select Project</option>";

    projects.forEach(project => {
        
        console.log(project.projectName);
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.projectName;
    projectSelect.appendChild(option);

    
    });
}


 function validateExpenseForm() {
        const myForm = document.getElementById('myForm');

        if(!myForm) return;

        const addBtn = document.getElementById('add-btn');
        const projectName = document.getElementById('projectSelect');
        const dateInput = document.getElementById('dateInput');
        const amountInput = document.getElementById('amountInput');
        const categoryInput = document.getElementById('category');
        const noteInput = document.getElementById('noteInput');
        const msg = document.getElementById('msg');


        myForm.addEventListener("submit", (e) =>  {
            e.preventDefault();
            console.log('Form submitted');

            if (projectName.value === "" || dateInput.value === "" || amountInput.value === "" || categoryInput.value === "") {
                msg.innerHTML = "please enter all Field";
                msg.style.color = 'red';
                return;
            }
            if (Number(amountInput.value) < 5000 ) {
                msg.innerHTML = "Amount must be 5000 or higher";
                msg.style.color = 'red';
                return;
            }

            else {
                msg.innerHTML = " Added Successfully";
                msg.style.color = "green";
            }

        expenses.push( 
        {
                projectId: projectName.value,
                category: categoryInput.value.trim(),
                amount: Number(amountInput.value),
                date: dateInput.value.trim(),
                notes: noteInput.value.trim(),
                status: "Pending"
            });

        localStorage.setItem("expenses", JSON.stringify(expenses));


// // this is to update the money spent from the expenses to the project
let projects = JSON.parse(localStorage.getItem("projects")) || []

let project = projects.find(p => Number(p.id) === Number(projectName.value));

if (project) {
    project.spent = (project.spent || 0) + Number(amountInput.value);
}

  localStorage.setItem("projects", JSON.stringify(projects));

expenses = JSON.parse(localStorage.getItem('expenses')) || [];

renderProjectCards();
updateDashboard();
});
}

//close btn modal for expenses page
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener('click', () => {
    modal.style.display = "none"
    msg.innerHTML = "";
    myForm.reset();
});

const projectBudgetInput = document.getElementById("projectBudgetInput");

projectBudgetInput.addEventListener("change", () => {
    const projectBudget = Number(projectBudgetInput.value);
    localStorage.setItem('ProjectTotalBudget', projectBudget);
    
});



// this is to update the main overview
function updateDashboard() {
console.log("selected id:", localStorage.getItem("selectedProjectId"));
console.log("Expenses:", expenses);
console.log("projects:", localStorage.getItem("projects"));

const selectedProjectId = localStorage.getItem("selectedProjectId");
console.log("using project:", selectedProjectId);

   let totalSpent = 0;

    // this is for the budget breakdown
    const categoryTotals = {
    materials: 0,
    labour: 0,
    equipment: 0,
    transportation: 0,
    miscellaneous: 0
};

    const projects = JSON.parse(localStorage.getItem("projects")) || [];

let totalBudget = 0;

   if (selectedProjectId) {
    const project = projects.find(p => String(p.id) === String(selectedProjectId));

    if (project) {
        totalBudget = project.budget;
    } 
    }
       
    expenses.forEach(expense => {

        if (selectedProjectId && String(expense.projectId) !== String(selectedProjectId)) { 
                return;
            }
     
        // const cat = expense.category;
        const amount = Number(expense.amount);
        totalSpent += amount;
    //    categoryTotals[cat] += amount;

    if (categoryTotals[expense.category] !== undefined) {
        categoryTotals[expense.category] += amount;
    }
    });

//  const  totalBudget = Number(localStorage.getItem("totalBudget")) || 500000;

    const remainingBudget = totalBudget - totalSpent;


    document.getElementById('totalBudget').textContent = "₦" + (totalBudget || 0).toLocaleString();

   document.getElementById('totalSpent').textContent = "₦" + (totalSpent || 0).toLocaleString();

   document.getElementById('remainingBudget').textContent = "₦" + (remainingBudget || 0).toLocaleString();

   //this count the number of expenses added
   let filteredCount = 0;
   expenses.forEach(expense => {
    if (selectedProjectId && String(expense.projectId) !== String(selectedProjectId)) {
        return;
    }
    filteredCount++;
   });

   document.getElementById('expenseCount').textContent = filteredCount;


   // this is for recent expenses table
   const tableBody = document.getElementById('activityTable');

   tableBody.innerHTML = "";


   // the slice, reverse makes the new added expenses comes first
   expenses.slice().reverse().forEach((expense, index) =>  {

     if (selectedProjectId) {
            if (String(expense.projectId) !== String(selectedProjectId)) { 
                return;

            }
        }
    // if (selectedProjectId && string(expense.projectId) !== string(selectedProjectId)) {
    //     return;
    // }

    const realIndex = expenses.length - 1 - index;

   const row = document.createElement('tr');

   const dateParts = expense.date.split("-").reverse().join("-");
 
 let statusColor;

   if (expense.status === "Approved") {
    statusColor = "text-green-600";
   } else if (expense.status === "Pending") {
    statusColor = "text-yellow-600";
   }
   else if (expense.status === "Rejected") {
    statusColor = "text-red-600";
   }

   const projects = JSON.parse(localStorage.getItem("projects")) || [];
   const project = projects.find(p => Number(p.id) === Number(expense.projectId));
      const projectName = project ? project.projectName : "Unknown";
   /*new Date(expense.date).toLocaleString('en-GB')*/ // we can also use this for the date

   // this is for the recent expenses
   row.innerHTML = `
        <td class="border-b py-2">${projectName}</td>
        <td class="border-b py-2">${expense.category}</td>
        <td class="border-b py-2">₦ ${Number(expense.amount).toLocaleString()}</td>
        <td class="border-b py-2">${dateParts}</td>
        <td class="border-b py-2 ${statusColor} font-semibold">${expense.status}</td>
    
        <td class="border-b py-2"> 

        <button class="approve-btn text-green-600">Approve</button>
        /
        <button class="reject-btn text-red-600">Reject</button>
        </td>
        <td class="border-b py-2">
        <button class="delete-btn text-red-600 font-bold">Delete</button>
        </td>
   `;

   tableBody.appendChild(row);

   //this delete button also deletes the spent in project page when clicked in the overview recent expenses
  row.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();

    // variable to delete the spent in project page
    const deletedExpense = expenses[realIndex];
    console.log('deleting:', deletedExpense);


    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    // variable to delete the spent in project page
    let project = projects.find(p => String(p.id) === String(deletedExpense.projectId));
    console.log('Matched project:', project);

    if (project) {
        project.spent = (project.spent || 0) - Number(deletedExpense.amount);

    if (project.spent < 0) project.spent = 0;
     }

     localStorage.setItem("projects", JSON.stringify(projects));

    /* this is a popup modal to confirm if you really want to delete the expenses
     if(confirm(`Delete expenses for ${expense.project}?`)) */
    expenses.splice(realIndex, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));
    
    

    renderProjectCards();
    updateDashboard();

    // }
   });

 row.querySelector('.approve-btn').addEventListener('click', () => {
    expenses[realIndex].status = "Approved";

    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateDashboard()
 });

 row.querySelector('.reject-btn').addEventListener('click', () => {
    expenses[realIndex].status = "Rejected";

    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateDashboard()
 });
 
});

if (tableBody.innerHTML === "") {
    tableBody.innerHTML = `
    <tr>
        <td colspan="6" class="text-center py-4 text-red-500">
        No expenses for this project
        </td>
    <tr>
    `;
} 


  const categoryPercent = {};

for (const cat in categoryTotals) {
    if (totalSpent > 0) {
        categoryPercent[cat] = (categoryTotals[cat] / totalSpent) * 100;
    }
    else {
        categoryPercent[cat] = 0  
    }
}

// this variable is for the budget breakdown
document.getElementById('materialsAmount').textContent = "₦" + categoryTotals.materials.toLocaleString();
document.getElementById('materialsPercent').textContent = Math.round(categoryPercent.materials);

document.getElementById('labourAmount').textContent = "₦" + categoryTotals.labour.toLocaleString();
document.getElementById('labourPercent').textContent = Math.round(categoryPercent.labour);

document.getElementById('equipmentAmount').textContent = "₦" + categoryTotals.equipment.toLocaleString();
document.getElementById('equipmentPercent').textContent = Math.round(categoryPercent.equipment);

document.getElementById('transportationAmount').textContent = "₦" + categoryTotals.transportation.toLocaleString();
document.getElementById('transportationPercent').textContent = Math.round(categoryPercent.transportation);

document.getElementById('miscellaneousAmount').textContent = "₦" + categoryTotals.miscellaneous.toLocaleString();
document.getElementById('miscellaneousPercent').textContent = Math.round(categoryPercent.miscellaneous);

renderCharts();

}

renderCharts();


// this is for the project page cards
function renderProjectCards() {
    const projectContainer = document.getElementById("projectCardContainer");

    if(!projectContainer) return;

    const projects = JSON.parse(localStorage.getItem("projects")) || []

    projectContainer.innerHTML = "";

    projects.forEach(project => {
        const remaining = project.budget - (project.spent || 0);

        //this is for the progress bar in project page
        const percentUsed =  (project.spent / project.budget) * 100;
        let statusText = "";
        let statusColor = "text-green-600"

        if(remaining < 0) {
            statusText = "Over Budget"
            statusColor = "text-red-600"
        }
        const card = document.createElement("div");
        card.classList.add("project-card");

        
        card.innerHTML = `
        <div class="bg-white py-4 px-6 rounded-lg shadow-md">
              <h2 class="text-lg font-bold">${project.projectName}</h2>
            <div class="flex items-center gap-1">
              <p class="font-semibold">Budget:</p> 
              <span>₦${project.budget.toLocaleString()}</span>
            </div>

            <div class="flex items-center gap-1">
              <p class="font-semibold">Spent: </p>
                <span>₦${(project.spent || 0).toLocaleString()}</span>
            </div>

            <div class="flex items-center gap-1">
              <p>Remaining: 
              <span>₦${remaining.toLocaleString()}</span>
            </div>

            <p class="${statusColor} text-sm font-semibold mt-1">${statusText}

            <div class="flex items-center  justify-center  gap-1 w-full">
            <p>Progress:</p>
            <div class="bg-blue-600 rounded-full shadow-md w-full h-4 mt-1">
                <div class="bg-gray-200 h-4 rounded-full shadow-md" style="width: ${Math.min(percentUsed, 100)}%"></div>
            </div>
            </div>

            <div class="flex items-center justify-between">
            <button class="bg-orange-600 px-4 py-1 rounded-lg text-white mt-2 ">Edit</button>
            <button class="delete-btn bg-red-600 px-4 py-1 rounded-lg text-white mt-2 ">Delete</button>
            </div>

        </div>
        `;
        projectContainer.appendChild(card);
 
    
//this is the delete button for the project card it delete the cards at once
   card.addEventListener("click", (e) => {

    // If delete button is clicked → handle delete only
    if (e.target.classList.contains("delete-btn")) {
        e.stopPropagation();

        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projects = projects.filter(p => p.id !== project.id);
        localStorage.setItem("projects", JSON.stringify(projects));

        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses = expenses.filter(exp => String(exp.projectId) !== String(project.id));
        localStorage.setItem("expenses", JSON.stringify(expenses));

        renderProjectCards();
        updateDashboard();
        return;
    }

    // ✅ Single click works immediately
    localStorage.setItem("selectedProjectId", project.id);
    localStorage.setItem("selectedProjectName", project.projectName);

    window.location.href = "dashboard.html";
});
   });
              }

     


function updateProjectTitle() {
    const projectTitle = document.getElementById("projectTitle");

    if (!projectTitle) return;

    const selectedProjectName = localStorage.getItem("selectedProjectName");

    if (selectedProjectName) {
        projectTitle.textContent = selectedProjectName;
    } else {
        projectTitle.textContent = "Dashboard";
    }
}






// This is for the Charts
function renderCharts() {
    const selectedProjectId = localStorage.getItem("selectedProjectId");

      let totalBudget = 0;

      const projects = JSON.parse(localStorage.getItem("projects")) || [];

       if (selectedProjectId) {
    const project = projects.find(p => String(p.id) === String(selectedProjectId));
        if (project) {
        totalBudget = project.budget;
    } 
}
    // This is for the line chat
    const monthlyTotals = {};

    expenses.forEach(expense => {
         if (selectedProjectId && String(expense.projectId) !== String(selectedProjectId)) { 
                return;
            }
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
        if (!monthlyTotals[monthKey])
            monthlyTotals[monthKey] = 0;
        monthlyTotals[monthKey] += expense.amount;
    });

    const lineLabels = Object.keys(monthlyTotals).sort();
    const lineDate = lineLabels.map(key => monthlyTotals[key]);

    const lineCtx = document.getElementById('lineChart').getContext('2d');

    if(window.lineChartInstance)
        window.lineChartInstance.destroy();
    window.lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: lineLabels,
            datasets: [{
                label: 'Monthly Spending',
                data: lineDate,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true} }
        }
    });


    // This is for the Bar chart
   

    const projectTotals = {};
    expenses.forEach(expense => {
 if (selectedProjectId && String(expense.projectId) !== String(selectedProjectId)) { 
                return;
            }
        
        if (!projectTotals[expense.projectId])
            projectTotals[expense.projectId] = 0
        projectTotals[expense.projectId] += expense.amount;
    });

     const barLabels = Object.keys(projectTotals)
    const barData = Object.values(projectTotals);

    const barCtx = document.getElementById('barChart').getContext('2d');
    if(window.barChartInstance)
        window.barChartInstance.destroy();
    window.barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                label: 'Project Spending',
                data: barData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)'
            }]
        },
        options: { responsive: true, 
            plugins: { 
                legend: 
                { 
                display: false 
            } 
        } 
    }
    });



    // This is for the Pie chart


        const categoryTotals = {
        Materials: 0,
        Labour: 0,
        Equipment: 0,
        Transportation: 0,
        Miscellaneous: 0
    };

    expenses.forEach(expense => {
           if (selectedProjectId && String(expense.projectId) !== String(selectedProjectId)) { 
                return;
            }

        const cat = expense.category.charAt(0).toUpperCase() + expense.category.slice(1);

        if(categoryTotals.hasOwnProperty(cat))
            categoryTotals[cat] += expense.amount;
    });

    const pieLabels = Object.keys(categoryTotals);
    const pieData = Object.values(categoryTotals);

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if(window.pieChartInstance)
        window.pieChartInstance.destroy();
    window.pieChartInstance = new Chart(pieCtx, {
         type: 'pie',
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieData,
                backgroundColor:[ 
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 235, 0.7)'
                ]
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}



