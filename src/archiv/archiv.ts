
import axios from 'axios';
import SuraTranslation from '../model/SuraTranslation';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface TranslationResponse {
    result: Translation[];
}

interface Translation {
    id: string;
    sura: string;
    aya: string;
    arabic_text: string;
    translation: string;
    footnotes: null | string;
}


async function fetchAndStoreTranslationsWithVerification(suraNumber: number) {
    const languages = {
        english: 'english_rwwad',
        german: 'german_bubenheim',
        turkish: 'turkish_shaban',
        // english: 'english_saheeh'
    };

    let translationResults: any = {};

    for (const [key, value] of Object.entries(languages)) {
        try {
            const response = await axios.get(`https://quranenc.com/api/v1/translation/sura/${value}/${suraNumber}`);
            translationResults[key] = response.data.result;
            await delay(1000);
        } catch (error) {
            console.error(`Error fetching ${key} translations for Sura ${suraNumber}:`, error);
            return;
        }
    }

    for (let i = 0; i < translationResults.german.length; i++) {
        const aya = translationResults.german[i].aya;
        const suraTranslation = new SuraTranslation({
            sura: suraNumber,
            aya: parseInt(aya),
            text: {
                arabic: translationResults.german[i].arabic_text,
                german: translationResults.german[i].translation,
                turkish: translationResults.turkish[i].translation,
                english: translationResults.english[i].translation,
            },
            textLength: {
                arabic: translationResults.german[i].arabic_text.length,
                german: translationResults.german[i].translation.length,
                turkish: translationResults.turkish[i].translation.length,
                english: translationResults.english[i].translation.length,
                min: Math.min(
                    translationResults.german[i].arabic_text.length, translationResults.german[i].translation.length, translationResults.turkish[i].translation.length, translationResults.english[i].translation.length),
                max: Math.max(
                    translationResults.german[i].arabic_text.length, translationResults.german[i].translation.length, translationResults.turkish[i].translation.length, translationResults.english[i].translation.length),
            }
        });

        try {
            await suraTranslation.save();
        } catch (error) {
            console.error(`Error saving translations for Sura ${suraNumber}, Aya ${aya}:`, error);
        }
    }

    console.log(`Finished saving translations for Sura ${suraNumber}.`);
}

async function fetchAndStoreAllTranslations() {
    for (let suraNumber = 1; suraNumber <= 114; suraNumber++) {
        console.log(`Fetching translations for Sura ${suraNumber}...`);
        await fetchAndStoreTranslationsWithVerification(suraNumber);
        console.log(`Finished Sura ${suraNumber}. Waiting 5 seconds before continuing...`);
        await delay(1000);
    }
}

// fetchAndStoreAllTranslations();
