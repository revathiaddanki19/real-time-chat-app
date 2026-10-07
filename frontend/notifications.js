// STORE UNREAD MESSAGE COUNTS

const unreadMessages = {};


// =====================================================
// ASK FOR BROWSER NOTIFICATION PERMISSION
// =====================================================

if ("Notification" in window) {

    if (Notification.permission === "default") {

        Notification.requestPermission();

    }

}


// =====================================================
// CREATE NOTIFICATION SOUND
// =====================================================

function playNotificationSound() {

    const audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    const oscillator =
        audioContext.createOscillator();


    const gainNode =
        audioContext.createGain();


    oscillator.connect(
        gainNode
    );


    gainNode.connect(
        audioContext.destination
    );


    oscillator.frequency.value =
        800;


    gainNode.gain.value =
        0.1;


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.15
    );

}


// =====================================================
// SHOW BROWSER NOTIFICATION
// =====================================================

function showBrowserNotification(
    senderName,
    message
) {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    new Notification(
        "New message from " + senderName,
        {
            body: message,
            icon: ""
        }
    );

}


// =====================================================
// ADD UNREAD BADGE
// =====================================================

function addUnreadBadge(
    senderId
) {

    const userElement =
        document.querySelector(
            `.user-item[data-user-id="${senderId}"]`
        );


    if (!userElement) {

        return;

    }


    let badge =
        userElement.querySelector(
            ".unread-badge"
        );


    if (!badge) {

        badge =
            document.createElement(
                "span"
            );


        badge.className =
            "unread-badge";


        badge.style.cssText = `
            float: right;
            background: #dc2626;
            color: white;
            min-width: 22px;
            height: 22px;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;


        const userName =
            userElement.querySelector(
                ".user-name"
            );


        if (userName) {

            userName.style.display =
                "flex";

            userName.style.justifyContent =
                "space-between";


            userName.appendChild(
                badge
            );

        }

    }


    if (
        !unreadMessages[senderId]
    ) {

        unreadMessages[senderId] =
            0;

    }


    unreadMessages[senderId]++;


    badge.textContent =
        unreadMessages[senderId];

}


// =====================================================
// REMOVE UNREAD BADGE
// =====================================================

function removeUnreadBadge(
    userId
) {

    unreadMessages[userId] =
        0;


    const userElement =
        document.querySelector(
            `.user-item[data-user-id="${userId}"]`
        );


    if (!userElement) {

        return;

    }


    const badge =
        userElement.querySelector(
            ".unread-badge"
        );


    if (badge) {

        badge.remove();

    }

}


// =====================================================
// LISTEN FOR REAL-TIME MESSAGES
// =====================================================

socket.on(
    "receiveMessage",
    (data) => {

        console.log(
            "Notification system received:",
            data
        );


        // ---------------------------------------------
        // Ignore messages sent by ourselves
        // ---------------------------------------------

        if (
            data.sender ===
            currentUserId
        ) {

            return;

        }


        // ---------------------------------------------
        // Check whether this chat is currently open
        // ---------------------------------------------

        const isCurrentChat =
            selectedUserId ===
            data.sender;


        // ---------------------------------------------
        // If current chat is open,
        // no unread notification is required.
        // ---------------------------------------------

        if (isCurrentChat) {

            return;

        }


        // ---------------------------------------------
        // Find sender name
        // ---------------------------------------------

        let senderName =
            "New message";


        const senderElement =
            document.querySelector(
                `.user-item[data-user-id="${data.sender}"]`
            );


        if (senderElement) {

            const nameElement =
                senderElement.querySelector(
                    ".user-name"
                );


            if (nameElement) {

                senderName =
                    nameElement
                        .childNodes[0]
                        .textContent
                        .trim();

            }

        }


        // ---------------------------------------------
        // Add unread count
        // ---------------------------------------------

        addUnreadBadge(
            data.sender
        );


        // ---------------------------------------------
        // Play notification sound
        // ---------------------------------------------

        try {

            playNotificationSound();

        }

        catch (error) {

            console.log(
                "Notification sound error:",
                error
            );

        }


        // ---------------------------------------------
        // Browser notification
        // ---------------------------------------------

        showBrowserNotification(
            senderName,
            data.message
        );

    }
);


// =====================================================
// CHECK WHEN USER SELECTS A CHAT
// =====================================================

document.addEventListener(
    "click",
    (event) => {

        const userItem =
            event.target.closest(
                ".user-item"
            );


        if (!userItem) {

            return;

        }


        const userId =
            userItem.dataset.userId;


        if (userId) {

            removeUnreadBadge(
                userId
            );

        }

    }
);