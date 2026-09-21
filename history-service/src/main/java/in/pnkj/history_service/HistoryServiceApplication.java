package in.pnkj.history_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class HistoryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(HistoryServiceApplication.class, args);
	}

}
