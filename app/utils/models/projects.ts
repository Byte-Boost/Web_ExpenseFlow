class Project {
    id: number | null;
    name: string;
    preferences: ProjectPreference | null;
    constructor(name: string, preferences: ProjectPreference | null = null, id: number | null = null) {
        this.id = id;
        this.name = name;
        this.preferences = preferences;
    }
}
class ProjectPreference{
    refundLimit: number;
    expenseLimit: number;
    quantityValues: Array<{[key: string]: number}>;
    constructor(refundLimit: number, expenseLimit: number, quantityValues: Array<{[key: string]: number}>) {
        this.refundLimit = refundLimit;
        this.expenseLimit = expenseLimit;
        this.quantityValues = quantityValues;
    }
}