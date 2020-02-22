import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { receiverStorageStructure } from '../util/receiverStorageStructure';

const NotificationListener = (notification) => {
  const { app, title, text } = notification;
  // console.log("App : " + app);
  // console.log("Title : " + title);
  // console.log("Text : " + text);

  AsyncStorage.getItem('receiver')
    .then(receiver => {
      if(!receiver) {
        receiver = {
          ...receiverStorageStructure
        }
      } else {
        receiver = JSON.parse(receiver);
      }
      const currDate = moment().format("DD/MM/YY");
      const notification = {
        date: currDate,
        count: 1,
        clickedCount: 0,
        apps: {
          [app]: 1
        }
      }
      const len = receiver.notifications.length;
      if(len === 0) {
        receiver.notifications.push(notification);
      } else {
        let curr = receiver.notifications[len - 1];
        if(curr.date === currDate) {
          receiver.notifications[len - 1].count = curr.count + 1;
          if(curr.apps) {
            if(curr.apps[app]) {
              receiver.notifications[len - 1].apps[app] += 1;
            } else {
              receiver.notifications[len - 1].apps[app] = 1;
            }
          } else {
            receiver.notifications[len - 1].apps = {
              [app]: 1
            }
          }
        } else {
          receiver.notifications.push(notification);
        }
      }
      AsyncStorage.setItem('receiver', JSON.stringify(receiver));
    })
    .catch(e => {
      console.log("Unable to read receiver from AsyncStorage.");
    });
}

export const NotificationRemoved = (data) => {
  // 2, 12 Removed 
  // 1, 8 Clicked

  // Cleared
  // 12 : Notification was canceled because it was a member of a canceled group.
  // 3  : Notification was canceled by the status bar reporting a user dismiss all.
  // 2  : Notification was canceled by the status bar reporting a user dismissal.

  // Clicked
  // 1  : Notification was canceled by the status bar reporting a notification click.
  // 8  : Notification was canceled by the app canceling this specific notification.
  // 9  : Notification was canceled by the app cancelling all its notifications.
  // console.log(data);

  if(data.reason === "1" || data.reason === "8") {
    AsyncStorage.getItem('receiver')
      .then(receiver => {
        if(!receiver) {
          receiver = {
            ...receiverStorageStructure
          }
        } else {
          receiver = JSON.parse(receiver);
        }
        const currDate = moment().format("DD/MM/YY");
        const notification = {
          date: currDate,
          count: 0,
          clickedCount: 1,
          apps: {},
          clicked: {
            [data.app] : 1
          }
        }
        const len = receiver.notifications.length;
        if(len === 0) {
          receiver.notifications.push(notification);
        } else {
          let curr = receiver.notifications[len - 1];
          if(curr.date === currDate) {
            receiver.notifications[len - 1].clickedCount = (curr.clickedCount ? curr.clickedCount : 0) + 1;
            if(curr.clicked) {
              if(curr.clicked[data.app]) {
                receiver.notifications[len - 1].clicked[data.app] += 1;
              } else {
                receiver.notifications[len - 1].clicked[data.app] = 1;
              }
            } else {
              receiver.notifications[len - 1].clicked = {
                [data.app]: 1
              }
            }
          } else {
            receiver.notifications.push(notification);
          }
        }
        AsyncStorage.setItem('receiver', JSON.stringify(receiver));
      })
      .catch(e => {
        console.log("Unable to read receiver from AsyncStorage.");
      });
  }
}

export default NotificationListener;