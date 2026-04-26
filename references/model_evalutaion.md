**1. Penalized mean (mean + λ·std)**
En yaygın ve esnek formülasyon:
$$\text{Score} = \overline{MSE} + \lambda \cdot \sigma(MSE)$$
λ risk-aversion parametresi: λ=1 makul başlangıç, λ=2 daha tutucu (worst-case'e yakın). Bu yaklaşım portföy teorisindeki mean-variance optimizasyonunun doğrudan karşılığıdır (Markowitz).

**2. One Standard Error Rule (Breiman ve diğ., 1984)**
Klasik ve çok prensipli bir kural — özellikle cross-validation bağlamında:
- En düşük ortalama MSE'ye sahip modeli (M\*) bul.
- M\*'ın ortalaması + 1·SE eşiği içinde kalan modeller arasından en basit/stabil olanı seç.

Bu, "istatistiksel olarak ayırt edilemeyen modeller arasında daha güvenli olanı tercih et" mantığına dayanır. ESL (Hastie, Tibshirani, Friedman) bunu standart bir yöntem olarak önerir.

**3. Coefficient of Variation tabanlı**
$$\text{Score} = \overline{MSE} \cdot (1 + CV), \quad CV = \frac{\sigma(MSE)}{\overline{MSE}}$$
Avantaj: ölçek-bağımsız, λ ayarına ihtiyacı yok. Dezavantaj: ortalama çok düşükse CV patlayabilir.

**4. Upper Confidence Bound / pessimistik tahmin**
$$\text{Score} = \overline{MSE} + k \cdot \frac{\sigma(MSE)}{\sqrt{n}}$$
Penalized mean'in istatistiksel olarak motive edilmiş hali. k=1.96 → %95 üst güven sınırı. Fold sayısı n'e göre normalize ettiği için fold sayısından bağımsız karşılaştırma sağlar.

**5. CVaR / Worst-case ortalaması (robust seçim)**
Tüm fold'ların ortalaması yerine en kötü %α'lık fold'ların ortalamasını al (örn. %20 worst-case). Finans ve robust optimization literatüründen gelir; "kötü dönemlerde model nasıl davranıyor?" sorusuna doğrudan yanıt verir. Time series'te rejim değişimlerini yakalamada faydalı olabilir.

**6. Z-score birleşik skor**
Modeller arası karşılaştırma için her iki metriği ayrı ayrı standardize et:
$$\text{Score} = z(\overline{MSE}) + z(\sigma(MSE))$$
λ seçimine gerek kalmaz, fakat yorumu mean+λ·std kadar doğrudan değil.

**7. Pareto-optimal seçim (çok-amaçlı)**
ortalama MSE ve std(MSE)'yi iki ayrı amaç olarak tutup Pareto cephesini çıkar; tek bir skora indirgemek yerine trade-off'u görselleştir, sonra alan bilgisine göre karar ver. Akademik bir raporda zengin bir tartışma sunar.

