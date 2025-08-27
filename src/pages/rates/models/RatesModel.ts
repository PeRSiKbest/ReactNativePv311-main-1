import NbuRate from "../types/NbuRates";

class RatesModel {
    static #instance: RatesModel|null;
    static get instance(): RatesModel {
        if (RatesModel.#instance == null) {
            RatesModel.#instance = new RatesModel();
        }
        return RatesModel.#instance;
    }
    rates: Array<NbuRate> = [];
    shownRates: Array<NbuRate> = [];
    searchText: string = "";
}
export default RatesModel;