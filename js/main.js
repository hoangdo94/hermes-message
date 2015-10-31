var loadingIcon = '<span class="glyphicon glyphicon-repeat spinning"></span>';
var errorIcon = '<span class="glyphicon glyphicon-remove"></span>';
var successIcon = '<span class="glyphicon glyphicon-ok"></span>';

disableSubmitButton();
setNotificationMessage(loadingIcon, 'Initializing...');

QB.createSession({
    login: QBUser.login,
    password: QBUser.password
}, function(err, res) {
    if (res) {
        QB.chat.connect({
            userId: QBUser.id,
            password: QBUser.password
        }, function(err, roster) {
            if (err) {
                console.log(err);
                setNotificationMessage(errorIcon, 'Error occurred.');
            } else {
                enableSubmitButton();
                setNotificationMessage(successIcon, 'Ready.');

                $('#message-form').submit(function(e) {
                    e.preventDefault();
                    var to = $('#message-form input[type="radio"]:checked').val();
                    var message = $('#message-form textarea').val();

                    sendMessage(to, message);
                });
            }
        });
    } else {
        console.log(err);
        setNotificationMessage(errorIcon, 'Error occurred.');
    }
});

function enableSubmitButton() {
    $('#message-form button[type="submit"]').removeClass('disabled').prop('disabled', false);
}

function disableSubmitButton() {
    $('#message-form button[type="submit"]').addClass('disabled').prop('disabled', true);
}

function setNotificationMessage(icon, text) {
    $('#notification').html(icon + ' ' + text);
}

function sendMessage(to, message) {
    disableSubmitButton();
    setNotificationMessage(loadingIcon, 'Sending...');
    console.log(to, message);
    getUserChatIds(to, function(ids) {
        console.log(ids.length, 'users');
        var msg = {
            type: 'chat',
            body: message,
            extension: {
                save_to_history: 1,
            },
            senderId: QBUser.id
        };
        console.log(msg);
        ids.forEach(function(id) {
            var params = {
                type: 3,
                occupants_ids: [id]
            };
            QB.chat.dialog.create(params, function(err, createdDialog) {
                if (err) {
                    console.log(err);
                } else {
                    var msg = {
                        type: 'chat',
                        body: message,
                        extension: {
                            save_to_history: 1,
                        },
                        senderId: QBUser.id,
                    };
                    var opponentId = QB.chat.helpers.getRecipientId(createdDialog.occupants_ids, QBUser.id);
                    QB.chat.send(opponentId, msg);
                }
            });
        });
        $('#message-form textarea').val('');
        enableSubmitButton();
        setNotificationMessage(successIcon, 'Done!');
    })
}

function getUserChatIds(role, callback) {
    var query = new Parse.Query(Parse.Object.extend('User'));
    query.exists('chat_user_id');
    query.limit(1000);
    if (role === 'tutor') {
        console.log('find tutors');
        query.equalTo('role', 2);
    }
    if (role === 'student') {
        console.log('find students');
        query.equalTo('role', 1);
    }
    if (role === 'all') {
        console.log('find all');
        query.containedIn('role', [1, 2]);
    }
    query.find({
        success: function(results) {
            var ids = [];
            results.forEach(function(result) {
                var chatId = result.get('chat_user_id');
                ids.push(chatId);
            });
            if (callback) {
                callback(ids);
            }
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            $('#message-form textarea').val('');
            enableSubmitButton();
            setNotificationMessage(errorIcon, 'Error occurred. Please try again!');
        }
    });
}
