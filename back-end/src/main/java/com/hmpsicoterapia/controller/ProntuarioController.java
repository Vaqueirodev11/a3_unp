package com.hmpsicoterapia.controller;

import com.hmpsicoterapia.dto.ProntuarioDTO;
import com.hmpsicoterapia.entity.Prontuario;
import com.hmpsicoterapia.service.ProntuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prontuarios")
@RequiredArgsConstructor
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    @PostMapping
    public ResponseEntity<?> criarProntuario(@Valid @RequestBody ProntuarioDTO dto,
                                             @AuthenticationPrincipal UserDetails user) {
        Prontuario p = prontuarioService.criarProntuario(dto, user.getUsername());
        return ResponseEntity.ok(p);
    }

    @GetMapping
    public ResponseEntity<List<Prontuario>> buscarProntuarios(@RequestParam(required = false, defaultValue = "") String filtro) {
        return ResponseEntity.ok(prontuarioService.buscarProntuarios(filtro));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProntuario(@PathVariable Long id) {
        return prontuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProntuario(@PathVariable Long id,
                                                 @Valid @RequestBody ProntuarioDTO dto,
                                                 @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.atualizarProntuario(id, dto, user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
