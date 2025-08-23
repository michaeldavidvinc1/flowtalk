import moment from "moment-timezone";

moment.tz.setDefault("Asia/Jakarta");

const RealDate = Date;

(global as any).Date = class extends RealDate {
    constructor(...args: any[]) {
        if (args.length === 0) {
            super(moment().tz("Asia/Jakarta").toDate());
        } else {
            super(...(args as [any]));
        }
    }
};
