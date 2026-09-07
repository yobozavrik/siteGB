import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

const official = "https://galia-baluvana.com";

const categories = [
  ["Гомілки - Нагетси", "homilky", "bIGFP4fRUb6dtdv8aytk7MN4gr6F6NlPvvkpBDm9/bIGFP4fRUb6dtdv8aytk7MN4gr6F6NlPvvkpBDm9_res600x400_opt.jpg"],
  ["Млинці - Вареники", "mlyntsi-vareniki", "KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM/KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM_res600x400_opt.jpg"],
  ["Картопляні вироби", "kartoplyani", "XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2/XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2_res600x400_opt.jpg"],
  ["Ковбаси · Паштет", "kovbasy", "2kqR3c2V2AKIqm1reEpzBTfXQxL7USblQwlJm1gY/2kqR3c2V2AKIqm1reEpzBTfXQxL7USblQwlJm1gY_res600x400_opt.jpg"],
  ["Котлети · Тефтелі", "kotlety", "7FojIlejzfiFGAAIbyc90zp23Q3zAOv99aZfzZ6U/7FojIlejzfiFGAAIbyc90zp23Q3zAOv99aZfzZ6U_res600x400_opt.jpg"],
  ["Пельмені - Хінкалі", "pelmeni", "heUByTjRCe5gFfKrRkKrUYwv8PQVtncVrjuqK9i4/heUByTjRCe5gFfKrRkKrUYwv8PQVtncVrjuqK9i4_res600x400_opt.jpg"],
  ["Піца - Пироги", "pizza-pyrohy", "btGbtGY39D1Bm0LCrdLVvrOlmMDnGwgs5EXUeQjR/btGbtGY39D1Bm0LCrdLVvrOlmMDnGwgs5EXUeQjR_res600x400_opt.jpg"],
  ["Сирники", "syrnyky", "1Vq3uTefVtVUIM2zSMETMnqqUVcWrX5YDHxI4dtf/1Vq3uTefVtVUIM2zSMETMnqqUVcWrX5YDHxI4dtf_res600x400_opt.jpg"],
] as const;

const posts = [
  ["Франшиза — це не піраміда. Це коли тобі дають готову інструкцію і підтримку", "27.10.2025", "vf2GIbff9Oe6zW4RxcYbjS1159k0OFhTbs2nsN8f.jpg"],
  ["Пельмені — то не гріх: чому напівфабрикати — це не про лінь, а про розум", "23.10.2025", "STmW0B2HJmK8Li9i35pY66E8dPmPZQCELOe54gtZ.jpg"],
  ["Хочу свій бізнес, але боюся: 5 думок, які заважають стартувати", "16.10.2025", "UjNvSf72L67lbAKGYCLCizh9GWXNGPMKsqz7ymyw.jpg"],
] as const;

const storage = (file: string) => `${official}/storage/uploads/images/${file}`;

const OfficialHome = () => (
  <main className="gb-official-home">
    <section className="gb-banner">
      <div className="gb-container gb-banner__inner">
        <div className="gb-banner__copy">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            м. Чернівці
          </div>
          <h1>Домашні напівфабрикати ручного ліплення у <b>Чернівцях</b></h1>
          <div className="gb-banner__actions">
            <Link to="/shops" className="gb-button">14 магазинів у Чернівцях</Link>
            <Link to="/menu" className="gb-text-link">Перейти до меню <ArrowRight size={17} /></Link>
          </div>
        </div>
        <img src={storage("5LvLX25B2scRahWW3At6nj5Dp3X4OdhZbiQxPJ8C.jpg")} alt="Найпопулярніші страви Галя Балувана Чернівці" />
      </div>
    </section>

    <section className="gb-section gb-container">
      <h2>Меню <b>Галя Балувана Чернівці</b></h2>
      <p className="gb-lead">Ознайомтеся з повним асортиментом напівфабрикатів ручного ліплення: вареники, пельмені, млинці, сирники, котлети та випічка.</p>
      <div className="gb-categories">
        {categories.map(([title, slug, image]) => (
          <Link key={slug} to={`/menu/${slug}`} className="gb-category">
            <img src={storage(image)} alt={title} />
            <span>{title}</span>
          </Link>
        ))}
      </div>
      <div className="gb-center"><Link to="/menu" className="gb-button">Відкрити все меню</Link></div>
    </section>

    <section className="gb-section gb-container gb-why">
      <img src={`${official}/images/why-galya.jpg`} alt="Відкрите виробництво Галя Балувана Чернівці" />
      <div>
        <h2>Чому обирають <b>Галя Балувана</b>?</h2>
        <div className="gb-reasons">
          <p><strong>Відкрита кухня</strong> — виробництво за склом просто у магазині</p>
          <p><strong>100% ручна робота</strong> — домашнє ліплення з добірних інгредієнтів</p>
          <p><strong>Швидко та смачно</strong> — готова вечеря для всієї родини за 10 хвилин</p>
        </div>
      </div>
    </section>

    <section className="gb-section gb-container">
      <div className="gb-section-head"><h2>Корисні статті та <b>Новини</b></h2><Link to="/blog" className="gb-text-link">Усі матеріали <ArrowRight size={17} /></Link></div>
      <div className="gb-posts">
        {posts.map(([title, date, image]) => (
          <Link to="/blog" key={title} className="gb-post"><img src={storage(image)} alt="" /><span>{title}</span><small>{date}</small></Link>
        ))}
      </div>
    </section>

    <section className="gb-section gb-shops">
      <div className="gb-container gb-shops__inner">
        <div>
          <h2>Локації у <b>Чернівцях</b></h2>
          <p>Знайдіть найближчий магазин у вашому районі: Південний, Проспект, Гравітон, Центр, Головна, Калинівський ринок.</p>
          <Link to="/shops" className="gb-button">Переглянути 14 магазинів</Link>
        </div>
        <div className="gb-map-placeholder"><MapPin size={42} /><span>Чернівці · 14 локацій</span></div>
      </div>
    </section>

    <section className="gb-stats">
      <div className="gb-container">
        <h2>Створено з любов'ю для <b>Чернівчан</b></h2>
        <div>
          <p><strong>14</strong><span>Магазинів у Чернівцях</span></p>
          <p><strong>100%</strong><span>Ручне ліплення</span></p>
          <p><strong>200+</strong><span>Різноманітних страв</span></p>
        </div>
      </div>
    </section>
  </main>
);

export default OfficialHome;
