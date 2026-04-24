package com.syncbridge.domain.config.controller;

import com.syncbridge.domain.config.service.RoleConfigService;
import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/configs")
@RequiredArgsConstructor
public class RoleConfigController {

    private final RoleConfigService roleConfigService;

    @GetMapping("/{role}")
    public CommonResponse<Map<String, Object>> getConfig(@PathVariable Role role) {
        return CommonResponse.success(roleConfigService.getConfigByRole(role));
    }

    @PutMapping("/{role}")
    public CommonResponse<Void> updateConfig(@PathVariable Role role, @RequestBody Map<String, Object> config) {
        roleConfigService.updateConfig(role, config);
        return CommonResponse.success(null);
    }
}
