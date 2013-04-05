'use strict';

function addStatus(ev, status) {
  status = status || '';
  var $el = $(
    '<input class="input-block-level" placeholder="New Tweet Text" ' +
    'type="text" value="' + status + '">');

  $('#statuses').append($el);
  $el.focus();
}

function save() {
  var statuses = [];
  $('#statuses input').each(function(i, el) {
    var status = $(el).val().trim().replace(/,/g, '&#44;');
    if (status) {
      statuses.push(status);
    }
  });
  localStorage.setItem('statuses', statuses);
  localStorage.setItem('placeid', $('#placeid').val().trim());
  localStorage.setItem('geolocation', $('#geolocation').is(':checked'));
  localStorage.setItem('countdown', $('#countdown').val());
  localStorage.setItem('consumer-key', $('#consumer-key').val().trim());
  localStorage.setItem('shared-secret', $('#shared-secret').val().trim());
  localStorage.setItem('access-token', $('#access-token').val().trim());
  localStorage.setItem('access-secret', $('#access-secret').val().trim());

  chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.remove(tab.id);
  });
}

// initialize
(localStorage.getItem('statuses') || '').split(',').forEach(function(status) {
  addStatus(null, status.replace(/&#44;/g, ','));
});
$('#placeid').val(localStorage.getItem('placeid'));
$('#geolocation').prop('checked',
  localStorage.getItem('geolocation') === 'true');
$('#countdown').val(localStorage.getItem('countdown'));
$('#consumer-key').val(localStorage.getItem('consumer-key'));
$('#shared-secret').val(localStorage.getItem('shared-secret'));
$('#access-token').val(localStorage.getItem('access-token'));
$('#access-secret').val(localStorage.getItem('access-secret'));

// event handlers
$('#add-status').on('click', addStatus);
$('#save').on('click', save);

// i18n messages, relies on a data-message attribute
// TODO: there's probably a cleaner way to do this
var objects = document.getElementsByTagName('*'), i;
for(i = 0; i < objects.length; i++) {
  if (objects[i].dataset && objects[i].dataset.message) {
    objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.message);
  }
}

// disable geolocation input if using browser support
$("input[id='geolocation']").click(function(){
  if ($(this).is(':checked')) {
    $('#placeid').attr("disabled", true);
  } else {
    $('#placeid').attr("disabled", false);
  }
});
