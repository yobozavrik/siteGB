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
          <h1>Найпопулярніші страви у <b>Галя Балувана</b></h1>
          <div className="gb-banner__actions">
            <Link to="/shops" className="gb-button">Знайти магазин</Link>
            <Link to="/menu" className="gb-text-link">Перейти до меню <ArrowRight size={17} /></Link>
          </div>
        </div>
        <img src={storage("5LvLX25B2scRahWW3At6nj5Dp3X4OdhZbiQxPJ8C.jpg")} alt="Найпопулярніші страви Галя Балувана" />
      </div>
    </section>

    <section className="gb-section gb-container">
      <h2>Меню <b>Галя Балувана</b></h2>
      <p className="gb-lead">Для того, щоб подивитись меню з цінами, необхідно перейти в розділ «Меню» та обрати місто.</p>
      <div className="gb-categories">
        {categories.map(([title, slug, image]) => (
          <Link key={slug} to={`/menu/${slug}`} className="gb-category">
            <img src={storage(image)} alt={title} />
            <span>{title}</span>
          </Link>
        ))}
      </div>
      <div className="gb-center"><Link to="/menu" className="gb-button">Перейти до меню</Link></div>
    </section>

    <section className="gb-section gb-container gb-why">
      <img src={`${official}/images/why-galya.jpg`} alt="Відкрите виробництво Галя Балувана" />
      <div>
        <h2>Чому саме <b>Галя Балувана</b>?</h2>
        <div className="gb-reasons">
          <p><strong>Висока</strong> якість</p>
          <p><strong>Широкий</strong> асортимент</p>
          <p><strong>Відкрите</strong> виробництво</p>
        </div>
      </div>
    </section>

    <section className="gb-section gb-container">
      <div className="gb-section-head"><h2>Наші <b>Новини</b></h2><Link to="/blog" className="gb-text-link">Усі статті <ArrowRight size={17} /></Link></div>
      <div className="gb-posts">
        {posts.map(([title, date, image]) => (
          <Link to="/blog" key={title} className="gb-post"><img src={storage(image)} alt="" /><span>{title}</span><small>{date}</small></Link>
        ))}
      </div>
    </section>

    <section className="gb-section gb-shops">
      <div className="gb-container gb-shops__inner">
        <div><h2>Наші <b>Магазини</b></h2><p>Оберіть своє місто та знайдіть найближчий магазин.</p><Link to="/shops" className="gb-button">Знайти магазин за містом</Link></div>
        <div className="gb-map-placeholder"><MapPin size={42} /><span>Мапа магазинів</span></div>
      </div>
    </section>

    <section className="gb-stats">
      <div className="gb-container"><h2>Щодня ми встановлюємо для себе нові <b>Рекорди</b></h2><div><p><strong>700</strong><span>Магазинів в Україні</span></p><p><strong>9000</strong><span>Робочих місць</span></p><p><strong>200+</strong><span>Різноманітних страв</span></p></div></div>
    </section>
  </main>
);

export default OfficialHome;
