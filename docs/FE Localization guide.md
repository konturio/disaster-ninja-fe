# FE Localization guide

Field: Content

For DN-FE translation we use gettext approach together with i18n:
* Wiki gettext <https://en.wikipedia.org/wiki/Gettext>
* Official GNU gettext site <https://www.gnu.org/software/gettext/gettext.html>

#### Tech details

We combine i18n and gettexts approaches (we have tech keys and values = real phrases in code and then convert them to .po and .pot files).

To support this we have several scripts:
* `i18n:export` converts i18next to gettext.
* `i18n:import` converts gettext to i18next.
* `i18n:update` extracts new translation keys from code to common.json and removes unused keys.
* `lint:i18n:keys:identity` is needed to see untranslated keys for all locales.

If we have untranslated keys, we have a fallback mechanism to show such phrases in the default language (English).

More details are in readme file <https://github.com/konturio/disaster-ninja-fe/blob/main/README.md>.

For the translation of content pages, we split them into paragraphs according to <https://www.gnu.org/software/gettext/manual/gettext.html#Preparing-Strings> (About page is an example). So if some content will be changed inside, we'll have one untranslated paragraph but not the whole page. 

#### Use Case 1 - New language is added

1. When a new language should be added, it's necessary to take the recent common.pot template from <https://github.com/konturio/disaster-ninja-fe/blob/main/src/core/localization/gettext/template/common.pot>.
2. Send .pot to the translation agency so that they translate all labels from it and return translated .po file with the requested local.
   1. Translation agency will create an invoice and after payment\*, they will start working on the translation\*\*.
   2. To preliminary calculate the price, we need to know the number of words for translations (there are some tools that can calculate it automatically based on uploaded .pot file; e.g. <https://poeditor.com/> - it calculates a number of words and characters in template + not translated delta if you upload .pot template + .po files of other languages).
3. Upload translated .po to DN FE repository and add a new language (task for FE should be created) so that QA will do the testing (new language is available and looks correct).
4. In case of the positive results of the QA testing, the next step would be to send the link to the translation agency so that they do the LQA for the text.
5. Once LQA tested - > new build with language can be released.

#### Use Case 2 - New labels/strings are added in English (and not translated to other languages)

1. When new strings are added to the application in English, we need to translate the delta between common.pot template (<https://github.com/konturio/disaster-ninja-fe/blob/main/src/core/localization/gettext/template/common.pot>) and target language .po file (e.g. <https://github.com/konturio/disaster-ninja-fe/blob/main/src/core/localization/gettext/es/common.po>).
2. Send .pot and .po (target language) files to the translation agency so that they translate all not translated labels and add them to .po file.
   1. note: translation agency works only with texts longer than 300 words.
   2. tips on how to calculate not translated words are mentioned in Case 1.
3. Upload translated .po file to DN FE repository (task for FE should be created) so that QA will do the testing  (all new translated labels are visible on FE).
4. In case of the positive results of the QA testing, the next step would be to send the link to the translation agency so that they do the LQA for the text.
5. Once LQA tested - > new build with additional labels for target language can be released.

\* for [[Tasks/project: [PL] Mapy Konturowe Spolka zoo#^131cd711-3bb4-11e9-9428-04d77e8d50cb/30ffc290-3d3d-11ec-8b80-cd41212d87de]] the payment day is Tuesday, please, keep it in mind while preparing a new language.  

\*\* we work with the translation agency "Mars Translation" (website <https://www.marstranslation.com/>). They were chosen based on a comparison of this vendor with 7 others. The table with all proposals can be found here: <https://docs.google.com/spreadsheets/d/1_5jkI0VlysJEs2pMFRG7E4ARVc35LGPqnpBs4eql1U4/edit?usp=sharing> 
