var RowsData = [];
var Rows = [];
var saved = "";

const OpenMenu = (data) => {
    $(`.main-wrapper`).fadeIn(0)
    SetHeader(data.header)
    AddRow(data.rows)
    SetButton(data.button)
}

function SetHeader(header) {
    var element
    element = $('<h1>' + header + '<h1>');
    $('.heading').append(element);
    saved = element
};

function SetButton(button) {
    var buttonText = button ? button : 'Submit'
    $('.btn').html(buttonText);
};

const CloseMenu = () => {
    $(`.main-wrapper`).fadeOut(0);
    $(saved).remove();
    RowsData = [];
    Rows = [];
    saved = "";
};

function AddRow(data) {
    RowsData = data
    for (var i = 0; i < RowsData.length; i++) {
        var message = RowsData[i].txt
        var id = RowsData[i].id
        var element

        element = $('<input placeholder ="' + message + '" type="text" ="form-control" id="' + id + '" class/>');
        $('.body').append(element);
        Rows[id] = element
    }
    setTimeout(() => {
        document.getElementById(0).focus();
    }, 100);
}

$(`#submit`).click(() => {
    SubmitData();
})

function SubmitData() {
    const returnData = [];
    for (var i = 0; i < RowsData.length; i++) {
        var id = RowsData[i].id
        var data = document.getElementById(id)
        if (data.value) {
            returnData.push({
                _id: id,
                input: data.value,
            });
        } else {
            returnData.push({
                _id: id,
                input: null,
            });
        }
        $(Rows[id]).remove();
    }
    PostData({
        data: returnData
    })
    CloseMenu();
}

const PostData = (data) => {
    return $.post(`https://${GetParentResourceName()}/buttonSubmit`, JSON.stringify(data))
}

const CancelMenu = () => {
    for (var i = 0; i < RowsData.length; i++) {
        var id = RowsData[i].id
        $(Rows[id]).remove();
    }
    $.post(`https://${GetParentResourceName()}/closeMenu`)
    return CloseMenu();
}

window.addEventListener("message", (event) => {
    const data = event.data
    const info = data.data
    const action = data.action
    switch (action) {
        case "OPEN_MENU":
            return OpenMenu(info);
        case "CLOSE_MENU":
            return CloseMenu();
        default:
            return;
    }
})

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == 'Escape') {
        CancelMenu();
    } else if (charCode == 'Enter') {
        SubmitData()
    }
};

$(document).click(function (event) {
    var $target = $(event.target);
    if (!$target.closest('.main-wrapper').length &&
        $('.main-wrapper').is(":visible")) {
        CancelMenu();
    }
});