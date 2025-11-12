import { useTranslation } from 'react-i18next';
export var useLanguage = function () {
    var i18n = useTranslation().i18n;
    var changeLanguage = function (lng) {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };
    return {
        currentLanguage: i18n.language,
        changeLanguage: changeLanguage
    };
};
