const Ruleset = {

    Name: { format: { pattern: "[a-zA-Z]+" } },
    Uid: { presence: true, length: { is: 16 } },
    Id: { presence: true, numericality: { onlyInteger: true, greaterThanOrEqual: 0, lessThan: 6 } },
    EMail: { email: true, presence: true },
    Changeemail: { email: true },
    Password: { presence: true, length: { is: 64 }, format: { pattern: "[0-9a-f]+" } },
    ChangePassword: { length: { is: 64 }, format: { pattern: "[0-9a-f]+" } },
    Street: { format: { pattern: "[a-zA-Z]+" } },
    Number: { numericality: { onlyInteger: true, greaterThanOrEqual: 0, lessThan: 99999 } },
    Plz: { numericality: { onlyInteger: true, greaterThanOrEqual: 10000, lessThan: 100000 } },
    Place: { format: { pattern: "[a-zA-Z]+" } },
    Datetime: { presence: true, format: { pattern: "[0-9]{4}\.[0-9]{2}\.[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}" } },
    Caption: { presence: true, format: { pattern: "[^<>]+" }, length: { maximum: 30 } },
    Text: { format: { pattern: "[^<>]+" }, length: { maximum: 200 } },
    Count: { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 100 } }
}

module.exports = Ruleset