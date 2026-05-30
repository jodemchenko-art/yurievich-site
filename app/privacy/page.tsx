import { SITE } from '@/lib/site';

export const metadata = {
  title: `Политика обработки персональных данных · ${SITE.name}`,
};

export default function PrivacyPage() {
  return (
    <article className="container-x py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold">Политика обработки персональных данных</h1>
      <p className="mt-4 text-brand-mute">
        Заполняя формы на сайте {SITE.name}, вы даёте согласие на обработку своих персональных данных
        (имя, телефон, контактные данные мессенджеров) с целью обработки заявки, подготовки сметы и
        связи с вами. Данные не передаются третьим лицам, кроме случаев, прямо предусмотренных законом.
      </p>
      <p className="mt-4 text-brand-mute">
        Срок хранения — до момента отзыва согласия. Чтобы отозвать согласие, напишите на наш Telegram
        или WhatsApp.
      </p>
    </article>
  );
}
