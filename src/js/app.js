/**
 * Welcome to Pebblebase!
 *
 * This is where you write your Firebase powered Pebble app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
require('./firebase');

var ref = new Firebase(YOUR_FIREBASE);

function showMenu() {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'View Data',
        subtitle: '(in Firebase)'
      },
      {
        title: 'Set a value',
        subtitle: '(in Firebase)'
      },
      {
        title: 'Push a value',
        subtitle: '(in Firebase)'
      },
      {
        title: 'Delete data',
        subtitle: '(in Firebase)'
      }]
    }]
  });

  menu.on('select', function(e) {
    switch (e.item.title) {
      case "View Data":
        showData();
        break;
      case "Set a value":
        ref.child('set/value').set(true);
        break;
      case "Push a value":
        ref.child("push").push((new Date().toString()));
        break;
      case "Delete data":
        ref.remove();
        break;
    }
    console.log('Selected item: ' + e.section + ' ' + e.item);
  });

  menu.show();
}

function showData() {
  // Create a new Pebble window
  var wind = new UI.Window();
  // Then create a textfield which will be updated by Firebase.
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: "Loading...",
    textAlign: 'center'
  });
  wind.add(textfield);

  // Pull up the most recent time pushed into our Firebase ref.
  ref
    .child('push')
    .limitToLast(1)
    .on('child_added', function (datetime) {
      var text = datetime.val() || "No data!";
      textfield.text(text);
      wind.show();
    });

  wind.on('hide', function () {
    /*
    Make sure we're only getting updates from
    Firebase when the card is displayed.
    */
    ref.child('push').off('child_added');
  });
}

// Make sure we show our main menu
showMenu();
