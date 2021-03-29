const Privileges = {

    Admin: 10,
    Coworker: 9,
    User: 5,
    Guest: 0,

    hasPrivilege(used, needed) {
        return used >= needed ? true : false
    }
}

module.exports = Privileges;