import express, {Request, Response} from 'express';
import {translateText} from "../utils";
import {ILocalizedText} from "../interfaces";

const router = express.Router();

router.post("/translate", async (req: Request, res: Response): Promise<void> => {
    const { sourceLanguage, sourceText } = req.body;

    if (!sourceLanguage || !sourceText) {
        res.status(400).send("Missing required fields");
        return;
    }

    const availableLanguages = ["tr", "de", "ar"];

    let responseObject: ILocalizedText = {
        tr: '',
        de: '',
        ar: '',
    };

    responseObject[sourceLanguage as keyof ILocalizedText] = sourceText;

    for (const language of availableLanguages) {
        if (language === sourceLanguage) {
            continue;
        }

        try {
            const translatedText = await translateText(sourceText, language.toUpperCase());
            responseObject[language as keyof ILocalizedText] = translatedText.translations[0].text;
        } catch (error) {
            console.error(`Error while translating in language ${language}:`, error);
        }
    }

    res.status(200).json({ result: responseObject });
});


export default router;
