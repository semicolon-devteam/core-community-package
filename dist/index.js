"use strict";exports.formatNumberWithComma=t=>{if(null==t||""===t)return"";const r=("number"==typeof t?t.toString():t).split(".");return r[0]=r[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),r.length>1?r.join("."):r[0]};
//# sourceMappingURL=index.js.map
