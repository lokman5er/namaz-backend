import mongoose, {Schema} from 'mongoose';
import {ITermsAccepted} from "../interfaces";

const TermsAcceptedSchema = new Schema<ITermsAccepted>(
    {
        deviceId: {
            type: String,
            unique: true,
            required: true,
        },
        termsVersion: {
            type: String,
            required: true,
        }
    },
    {
        collection: 'termsAccepted',
        timestamps: { createdAt: 'createdAt' },
    }
);

const TermsAcceptedModel = mongoose.model<ITermsAccepted>('TermsAccepted', TermsAcceptedSchema);

export default TermsAcceptedModel;
