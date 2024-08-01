import {DanmakuInfo} from "../api/danmaku";

export const convertToCSV = (array: DanmakuInfo[]) => {
    const header = Object.keys(array[0]).join(",") + "\n";
    const rows = array.map(obj => Object.values(obj).join(",")).join("\n");
    return header + rows;
}

export const downloadCSV = (data: DanmakuInfo[], filename: string) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], {type: "text/csv"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}