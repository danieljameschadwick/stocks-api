export class NoEntityFound extends Error {
    constructor(props) {
        super(props);

        this.name = 'NoEntityFound';
    }
}
