import {RegisteredApplication} from "windup-services";

describe('registered application model tests', () => {
    it ('has input path', () => {
        let model = <RegisteredApplication>{};
        model.inputPath = "testpath";
        expect(model.inputPath).toEqual("testpath");
    });
});