package in.pnkj.api_gateway_service.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class CookieToAuthHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || authHeader.isBlank()) {
            HttpCookie cookie = request.getCookies().getFirst("musy_access_token");
            if (cookie == null) {
                cookie = request.getCookies().getFirst("accessToken");
            }
            if (cookie != null && cookie.getValue() != null && !cookie.getValue().isBlank()) {
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("Authorization", "Bearer " + cookie.getValue())
                        .build();
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            }
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
