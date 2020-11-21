const electron = require('electron');
const {ipcRenderer} = electron;

const Store = require('./store.js');

window.$ = window.JQuery = require('jquery');

const store = new Store({
    configName: 'values-config',
    defaults: {
        operatorsList:  ['גלב', 'ארי'],
        technicList: ['איגור', 'סאשה', 'קוסטה', 'ארקדי'],
        outSourceWorkers: ['UPS', 'CONTEL', 'אדוויס', 'YM']
    }
});

$('#submit').on('click', (e) => {
    console.log("Submit clicked!");

    if (validateForm()) {
        console.log("Validation pass");
        var item = getFieldValues();
        ipcRenderer.send('item:add', item);
    }    
});

$('#reset').on('click', () => {
    console.log("Reset clicked!");
    ipcRenderer.send('item:reset');
});

$('input[type="radio"][id="department-choice"]').on('click', function () {
    
    if($(this).is(':checked')) {        
        $('#dep-choice-name').show();
        $('#out-choice-name').hide();
        // $('#out-choice-name').text("");
    }
});

$('input[type="radio"][id="outsource-choice"]').on('click', function () {
    
    if($(this).is(':checked')) {        
        $('#out-choice-name').show();
        $('#dep-choice-name').hide();
        // $('#dep-choice-name').text("");
    }
});

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());    
    return local.toJSON().slice(0,10);
});

Date.prototype.toTimeInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(11,16);
});

$(() => {

    $('#work-opened-date').val(new Date().toDateInputValue());
    $('#work-start-date').val(new Date().toDateInputValue());
    $('#work-end-date').val(new Date().toDateInputValue());
    $('#work-opened-time').val(new Date().toTimeInputValue());
    $('#work-start-time').val(new Date().toTimeInputValue());
    $('#work-end-time').val(new Date().toTimeInputValue());    
    
    addFloorNumbers();
    addOperatorsName();
    addTechniciansName();
    addDepartmentName();
    addOutSourceWorkers();
    
    //store.set('operatorsList', ['גלב', 'ארי', 'אחמ"ש']);
});

function addFloorNumbers() {

    var sel = document.getElementById('floor');
    
    for (let index = 1; index < 71; index++) {
        
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(index));
        sel.appendChild(option);
    }
}

function addOperatorsName() {

    // var names = ['גלב', 'ארי', 'אחמ"ש'];

    var names = store.get('operatorsList');
    createOptionsList(names, 'operator-name');
}

function  addTechniciansName() {

    // var names = ['איגור', 'סאשה', 'קוסטה', 'ארקדי'];
    var names = store.get('technicList');
    createOptionsList(names, 'technician-name'); 
}

function addDepartmentName() {

    var names = ['מיזוג אוויר', 'ניקיון', 'מעליות', 'אחזקה'];

    createOptionsList(names, 'dep-choice-name');
}

function addOutSourceWorkers() {

    // var names = ['UPS', 'CONTEL', 'אדוויס', 'YM'];
    var names = store.get('outSourceWorkers');
    createOptionsList(names, 'out-choice-name');
}

function createOptionsList(names, id) {

    var sel = document.getElementById(id);
    
    for (let index = 0; index < names.length; index++) {
        
        var option = document.createElement('option');
        option.value = index + 1;
        option.appendChild(document.createTextNode(names[index]));
        sel.appendChild(option);
    }
}

function getFieldValues() {       
    // // Main table properties
    // var workNumber = getWorkNumber();   
    // var clientOffice = document.getElementById('client-office-name').value;
    // var operatorName = document.getElementById('operator-name').value;
    // var workStatus = document.getElementById('work-status').value;
    // var workDescription = document.getElementById('input-work-description').value;
    // var clientName = document.getElementById('client-name').value;
    // var startDate = document.getElementById('work-opened-date').value;
    // var floor = document.getElementById('floor').value;
    // var technician = document.getElementById('technician-name').value;

    // // Office only properties    
    // var instrumentCode = document.getElementById('instruments-code').value;
    // var instrumentDescr = document.getElementById('instruments-description').value;
    // var clientCode = document.getElementById('client-office-code').value;    
    // var clientPhone = document.getElementById('client-phone').value;
    // var clientEmail = document.getElementById('client-email').value;
    // var workType = document.getElementById('work-type').value;
    // var repairDescr = document.getElementById('input-repair-description').value;
    // var repairComment = document.getElementById('input-repair-comment').value;
    // var costDetails = document.getElementById('cost-details').value;
    // var costWorker = document.getElementById('cost-worker').value;
    // var costParts = document.getElementById('cost-parts').value;
    // var costWorkerOutsource = document.getElementById('cost-worker-out').value;
    // var costOutsource = document.getElementById('cost-outsource').value;
    // var costPool = document.getElementById('cost-pool').value;
    // var costTotal = document.getElementById('cost-total').value;
    // var costPricelists = document.getElementById('cost-pricelists').value;   

    // //var clientType = document.getElementById('client-type').value;
    // //var client = document.getElementById('client').value;

    item = {
        // Main table properties
        clientName: document.getElementById('client-name').value,
        operatorName: getSelectedValue('operator-name'),
        workStatus: document.getElementById('work-status').value,
        technician: getSelectedValue('technician-name'),
        workDescription: document.getElementById('input-work-description').value,
        clientOffice: document.getElementById('client-office-name').value,
        floor: document.getElementById('floor').value,
        startDate: document.getElementById('work-opened-date').value.replace(/-/g, "/"),
        workNumber: getWorkNumber()
        // Office only properties    
        // instrumentCode: document.getElementById('instruments-code').value,
        // instrumentDescr: document.getElementById('instruments-description').value,
        // clientCode: document.getElementById('client-office-code').value,
        // clientPhone: document.getElementById('client-phone').value,
        // clientEmail: document.getElementById('client-email').value,
        // workType: document.getElementById('work-type').value,
        // repairDescr: document.getElementById('input-repair-description').value,
        // repairComment: document.getElementById('input-repair-comment').value,
        // costDetails: document.getElementById('cost-details').value,
        // costWorker: document.getElementById('cost-worker').value,
        // costParts: document.getElementById('cost-parts').value,
        // costWorkerOutsource: document.getElementById('cost-worker-out').value,
        // costOutsource: document.getElementById('cost-outsource').value,
        // costPool: document.getElementById('cost-pool').value,
        // costTotal: document.getElementById('cost-total').value,
        // costPricelists: document.getElementById('cost-pricelists').value

        //clientType : document.getElementById('client-type').value,
        //client : document.getElementById('client').value
    }      

    return item;       
}

function getSelectedValue(id) {

    var sel = document.getElementById(id);
    var opt = sel.options[sel.selectedIndex];

    return opt.text;
}

function getWorkNumber() {

    // --- TODO --- Add autoincrement DB work number instead of 100
    return new Date().toDateInputValue().replace(/-/g, "").trim() + "-" + 100;   
}

function validateForm() {

    var form = document.getElementsByTagName('form');
    console.log(form);
    console.log(getWorkNumber());

    console.log("Tpe: " + typeof document.getElementById('work-opened-date').value);
    

    if ( document.forms["work-registraton"]["client-office-name"].value == "" ) {        
        document.forms["work-registraton"]["client-office-name"].focus();
        return false;
    }    
    if ( document.forms["work-registraton"]["floor"].value == "" ) {        
        document.forms["work-registraton"]["floor"].focus();
        return false;
    }
    if ( document.forms["work-registraton"]["input-work-description"].value == "" ) {       
        document.forms["work-registraton"]["input-work-description"].focus();
        return false;
    }
    
    // $('#work-status').on('change', function() {
    //     workStatus = $(this).children('option:selected').val();
    //     console.log("WorkStatus Inside: " + workStatus);
    // });   

    if ( $('#operator-name option:selected').text() == "" ) {
        document.forms["work-registraton"]["operator-name"].focus();
        return false;
    }

    if ( $('#out-choice-name').is(':hidden') ) {
        return isRadioButtonFieldChecked("dep-choice-name");
    }

    if ( $('#dep-choice-name').is(':hidden') ) {
        return isRadioButtonFieldChecked("out-choice-name");
    }   
   
    // if ( document.forms["work-registration"]["technician-name"].value == "" ) {
    //     document.forms["work-registraton"]["technician-name"].focus();
    //     return false;
    // } 

    return true;
}

function isRadioButtonFieldChecked(id) {

    var isChecked = true;

    if ( $(`#${id} option:selected`).text() == "" ) {
        document.forms["work-registraton"][id].focus();
        isChecked = false;
    }

    // if ( $('#dep-choice-name option:selected').text() == "" ) {
    //     document.forms["work-registraton"]["dep-choice-name"].focus();
    //     isChecked = false;
    // }

    return isChecked;
}