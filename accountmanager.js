const Accountmanager = {

    login(params) {
        if (params.password === "deny")
            return
        else
            return { name: "Hermann Müller", points: 70 }

    }
};

module.exports = Accountmanager;