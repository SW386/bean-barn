export const checkIsPositive = (num : number) : boolean => {
    return num > 0
}

export const checkValidZip = (num : number) : boolean => {
    return num > 9999 && num < 100000
}

export const checkValidEmail = (email : string) : boolean => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}