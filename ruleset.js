const Ruleset = {

    Name: { format: { pattern: "[a-zA-Z]+" } },
    Uid: { presence: true, length: { is: 16 } },
    Id: { presence: true, numericality: true },
    EMail: { email: true, presence: true },
    Changeemail: { email: true },
    Password: { presence: true, length: { is: 64 }, format: { pattern: "[0-9a-f]+" } },
    ChangePassword: { length: { is: 64 }, format: { pattern: "[0-9a-f]+" } },
    Street: { format: { pattern: "[a-zA-Z]+" } },
    Number: { numericality: true },
    Plz: { numericality: true },
    Place: { format: { pattern: "[a-zA-Z]+" } },
    Datetime: { presence: true, format: { pattern: "[0-9]{4}\.[0-9]{2}\.[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}" } },
    Caption: { presence: true, format: { pattern: "[^<>]+" }, length: { maximum: 30 } },
    Text: { format: { pattern: "[^<>]+" }, length: { maximum: 200 } }

}

module.exports = Ruleset