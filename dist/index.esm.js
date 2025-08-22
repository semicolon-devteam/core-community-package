const t=t=>{if(null==t||""===t)return"";const n=("number"==typeof t?t.toString():t).split(".");return n[0]=n[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),n.length>1?n.join("."):n[0]};export{t as formatNumberWithComma};
//# sourceMappingURL=index.esm.js.map
