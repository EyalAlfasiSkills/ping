export const utilService = {
    getNameInitials
}

function getNameInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}