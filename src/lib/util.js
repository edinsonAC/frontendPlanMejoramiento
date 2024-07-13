import {notification} from 'ant-design-vue';

const openNotification = (type, message, description) => {
    notification[type]({
        message: message,
        description: description
    });
};

const parseJwt = (token) => {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    return JSON.parse(jsonPayload);
};
const delAccentMark = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const compareKeys = (obj1, obj2) => {
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return true;
};

const generateTxt = (file, nombreFile) => {
    let blob = new Blob([file], {
        type: "text/plain;charset=utf-8"
    });
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = nombreFile;
    a.click();
};

const compare = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
};

export {parseJwt, delAccentMark, compareKeys, generateTxt, compare, openNotification};
