package com.olx.config;

import com.olx.model.Listing;
import com.olx.model.User;
import com.olx.repository.ListingRepository;
import com.olx.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ListingRepository listingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Create demo users
        User user1 = userRepository.save(User.builder()
                .name("Karthik Sharma")
                .email("karthik@example.com")
                .password(passwordEncoder.encode("password123"))
                .phone("9876543210")
                .build());

        User user2 = userRepository.save(User.builder()
                .name("Priya Patel")
                .email("priya@example.com")
                .password(passwordEncoder.encode("password123"))
                .phone("9876543211")
                .build());

        User user3 = userRepository.save(User.builder()
                .name("Rahul Verma")
                .email("rahul@example.com")
                .password(passwordEncoder.encode("password123"))
                .phone("9876543212")
                .build());

        // Create demo listings
        listingRepository.saveAll(List.of(
            Listing.builder()
                .title("iPhone 14 Pro Max - Like New")
                .description("Barely used iPhone 14 Pro Max, 256GB, Deep Purple. Comes with original box, charger, and case. Battery health 98%. No scratches or dents.")
                .price(75000.0)
                .category("Mobiles")
                .location("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600")
                .user(user1)
                .build(),

            Listing.builder()
                .title("MacBook Air M2 2023")
                .description("MacBook Air M2, 8GB RAM, 256GB SSD. Midnight color. Perfect condition, used for 6 months only. Includes charger and laptop sleeve.")
                .price(89000.0)
                .category("Laptops")
                .location("Mumbai")
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600")
                .user(user2)
                .build(),

            Listing.builder()
                .title("Royal Enfield Classic 350")
                .description("2022 model, Signals edition. Only 5000 km driven. Single owner, all service records available. Matte black color.")
                .price(165000.0)
                .category("Vehicles")
                .location("Delhi")
                .imageUrl("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600")
                .user(user3)
                .build(),

            Listing.builder()
                .title("Samsung 55\" 4K Smart TV")
                .description("Samsung Crystal 4K UHD Smart TV. 2023 model. Excellent picture quality. Remote and stand included. Moving out sale.")
                .price(35000.0)
                .category("Electronics")
                .location("Hyderabad")
                .imageUrl("https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600")
                .user(user1)
                .build(),

            Listing.builder()
                .title("Wooden Study Table with Chair")
                .description("Solid wood study table with ergonomic chair. Table dimensions: 4x2 feet. Perfect for work from home setup. Minor scratches.")
                .price(8500.0)
                .category("Furniture")
                .location("Pune")
                .imageUrl("https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600")
                .user(user2)
                .build(),

            Listing.builder()
                .title("Canon EOS R50 Camera Kit")
                .description("Canon EOS R50 mirrorless camera with RF-S 18-45mm lens. Includes camera bag, extra battery, 64GB SD card. Bought 3 months ago.")
                .price(52000.0)
                .category("Electronics")
                .location("Chennai")
                .imageUrl("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600")
                .user(user3)
                .build(),

            Listing.builder()
                .title("PS5 with 2 Controllers")
                .description("PlayStation 5 Digital Edition with 2 DualSense controllers. Includes FIFA 24 and Spider-Man 2 game codes. Perfect working condition.")
                .price(38000.0)
                .category("Gaming")
                .location("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600")
                .user(user1)
                .build(),

            Listing.builder()
                .title("Honda Activa 6G - 2023 Model")
                .description("Honda Activa 6G, pearl white color. Only 3000 km driven. First owner. Insurance valid till Dec 2025. All documents clear.")
                .price(72000.0)
                .category("Vehicles")
                .location("Jaipur")
                .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600")
                .user(user2)
                .build()
        ));

        System.out.println("✅ Easy Trade demo data seeded successfully!");
        System.out.println("📧 Demo accounts: karthik@example.com, priya@example.com, rahul@example.com");
        System.out.println("🔑 Password: password123");
    }
}
