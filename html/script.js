let formInputs = {};
const formID = "";

const OpenMenu = (data) => {
    if (data == null || data == "") {
        console.log("No data detected");
        return null;
    }

    $(`.main-wrapper`).fadeIn(0);
	
	const formID = data.formID != null ? data.formID : "qb-input-form";
	const formClass = data.formClass != null ? data.formClass : "qb-input-form";
	const footerClass = data.footerClass != null ? data.footerClass : "footer";
	const headerClass = data.headerClass != null ? data.headerClass : "heading";
	const submitClass = data.submitClass != null ? data.submitClass : "btn btn-success";
	
    let form = [
		`<form id='${formID}' class='${formClass}'>`,
        `<div class="${headerClass}">${
            data.header != null ? data.header : "Form Title"
        }</div>`,
    ];

    data.inputs.forEach((item, index) => {
        switch (item.type) {
            case "text":
                form.push(renderTextInput(item));
                break;
            case "password":
                form.push(renderPasswordInput(item));
                break;
            case "number":
                form.push(renderNumberInput(item));
                break;
            case "radio":
                form.push(renderRadioInput(item));
                break;
            case "select":
                form.push(renderSelectInput(item));
                break;
            case "checkbox":
                form.push(renderCheckboxInput(item));
                break;
            default:
                form.push(`<div>${item.text}</div>`);
        }
    });
    form.push(
	
        `<div class="${footerClass}"><button type="submit" class="${submitClass}" id="submit">${
            data.submitText ? data.submitText : "Submit"
        }</button></div>`
    );

    form.push("</form>");

    $(".main-wrapper").html(form.join(" "));

    $(formID).on("change", function (event) {
        formInputs[$(event.target).attr("name")] = $(event.target).val();
    });

    $("#" + formID).on("submit", async function (event) {
		
        if (event != null) {
            event.preventDefault();
        }
        let formData = $("#" + formID).serializeArray();

        formData.forEach((item, index) => {
            formInputs[item.name] = item.value;
        });

        await $.post(
            `https://${GetParentResourceName()}/buttonSubmit`,
            JSON.stringify({ data: formInputs })
        );
        CloseMenu();
    });
};

const renderTextInput = (item) => {
    const { text, name } = item;
    formInputs[name] = "";
    const isRequired =
        item.isRequired == "true" || item.isRequired ? "required" : "";
	const inputClass = item.inputClass != null ? item.inputClass : "form-control";

    return ` <input placeholder="${text}" type="text" class="${inputClass}" name="${name}" ${isRequired}/>`;
};
const renderPasswordInput = (item) => {
    const { text, name } = item;
    formInputs[name] = "";
    const isRequired =
        item.isRequired == "true" || item.isRequired ? "required" : "";
	const inputClass = item.inputClass != null ? item.inputClass : "form-control";

    return ` <input placeholder="${text}" type="password" class="f${inputClass}" name="${name}" ${isRequired}/>`;
};
const renderNumberInput = (item) => {
    try {
        const { text, name } = item;
        formInputs[name] = "";
        const isRequired =
            item.isRequired == "true" || item.isRequired ? "required" : "";
		const inputClass = item.inputClass != null ? item.inputClass : "form-control";

        return `<input placeholder="${text}" type="number" class="${inputClass}" name="${name}" ${isRequired}/>`;
    } catch (err) {
        console.log(err);
        return "";
    }
};

const renderRadioInput = (item) => {
    const { options, name, text } = item;
    formInputs[name] = options[0].value;
	const divGroupClass = item.divGroupClass != null ? item.divGroupClass : "form-input-group";
	const divGroupTitleClass = item.divGroupTitleClass != null ? item.divGroupTitleClass : "select-title";
	const divInputGroupClass = item.divInputGroupClass != null ? item.divInputGroupClass : "input-group";

    let div = `<div class="${divGroupClass}"> <div class="${divGroupTitleClass}">${text}</div>`;
    div += `<div class="${divInputGroupClass}">`;
    options.forEach((option, index) => {
        div += `<label for="radio_${name}_${index}"> <input type="radio" id="radio_${name}_${index}" name="${name}" value="${
            option.value
        }" ${index == 0 ? "checked" : ""}> ${option.text}</label>`;
    });

    div += "</div>";
    div += "</div>";
    return div;
};

const renderCheckboxInput = (item) => {
    const { options, name, text } = item;
    formInputs[name] = options[0].value;
	const divGroupClass = item.divGroupClass != null ? item.divGroupClass : "form-input-group";
	const divGroupTitleClass = item.divGroupTitleClass != null ? item.divGroupTitleClass : "select-title";
	const divInputGroupClass = item.divInputGroupClass != null ? item.divInputGroupClass : "input-group";

    let div = `<div class="${divGroupClass}""> <div class="${divGroupTitleClass}">${text}</div>`;
    div += '<div class="input-group-chk">';

    options.forEach((option, index) => {
        div += `<label for="chk_${name}_${index}">${option.text} <input type="checkbox" id="chk_${name}_${index}" name="${name}" value="${option.value}"></label>`;
    });

    div += "</div>";
    div += "</div>";
    return div;
};

const renderSelectInput = (item) => {
    const { options, name, text } = item;
	const divSelectTitle = item.divSelectTitle != null ? item.divSelectTitle : "select-title";
	const divformSelect = item.divformSelect != null ? item.divformSelect : "form-select";
    let div = `<div class="${divSelectTitle}">${text}</div>`;

    div += `<select class="${divformSelect}" name="${name}" title="${text}">`;
    formInputs[name] = options[0].value;

    options.forEach((option, index) => {
        div += `<option value="${option.value}" ${
            option.checked != null ? "checked" : ""
        }>${option.text}</option>`;
    });
    div += "</select>";
    return div;
};

const CloseMenu = () => {
    $(`.main-wrapper`).fadeOut(0);
    $(formID).remove();
    formInputs = {};
};

const CancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return CloseMenu();
};

window.addEventListener("message", (event) => {
    const data = event.data;
    const info = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
            return OpenMenu(info);
        case "CLOSE_MENU":
            return CloseMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        CancelMenu();
    } else if (charCode == "Enter") {
        SubmitData();
    }
};

// IDK why this is a thing ? what if they misclick?
$(document).click(function (event) {
    var $target = $(event.target);
    if (
        !$target.closest(".main-wrapper").length &&
        $(".main-wrapper").is(":visible")
    ) {
        CancelMenu();
    }
});
