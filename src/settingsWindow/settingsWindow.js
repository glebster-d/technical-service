'use strict'

require('jquery');
window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('bootstrap');

const Store = require('../util/store.js');

const store = new Store({
    configName: 'values-config',
    defaults: {
        operatorsList:  ['גלב', 'ארי'],
        technicList: ['איגור', 'סאשה', 'קוסטה', 'ארקדי'],
        outSourceWorkers: ['UPS', 'CONTEL', 'אדוויס', 'YM']
    }
});

let operatorsList;
let technicList;
let outSourceWorkers;

$(() => {

    operatorsList = store.get('operatorsList');
    technicList = store.get('technicList');
    outSourceWorkers = store.get('outSourceWorkers');

    // document.getElementById('defaultOpened').click();

    // $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
    //     e.preventDefault();
    //     $(this).siblings('a.active').removeClass("active");
    //     $(this).addClass("active");
    //     var index = $(this).index();
    //     $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
    //     $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    // });
});

// function openSetting(event, settingName) {

//     var i, tabcontent, tablinks;

//     // Get all elements with class="tabcontent" and hide them
//     tabcontent = document.getElementsByClassName('tabcontent');

//     for (let index = 0; index < tabcontent.length; index++) {
        
//         tabcontent[index].style.display = "none";        
//     }

//     // Get all elements with class="tablinks" and remove the class "active"
//     tablinks = document.getElementsByClassName('tablinks');
    
//     for (let index = 0; index < tablinks.length; index++) {
        
//         tablinks[index].className = tablinks[index].className.replace(" active", "");        
//     }

//     // Show the current tab and add an "active" class to the link that opened the tab 
//     document.getElementById(settingName).style.display = "block";
//     event.currentTarget.className += " active";
// }

$('#btn-new-user').on('click', () => {
    console.log('clicked!');
    // var username = $('#username').
});

function validateForm(formName, elementName) {

    //if (document.forms[formName][elementName].v)
}

