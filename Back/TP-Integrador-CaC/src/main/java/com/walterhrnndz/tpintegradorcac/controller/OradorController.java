package com.walterhrnndz.tpintegradorcac.controller;

import com.walterhrnndz.tpintegradorcac.dto.OradorDto;
import com.walterhrnndz.tpintegradorcac.model.Orador;
import com.walterhrnndz.tpintegradorcac.service.OradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orador")
@RequiredArgsConstructor
public class OradorController {

    private final OradorService oradorService;

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<List<OradorDto>> getAll() {
        List<OradorDto> oradores = oradorService.getAll().stream().map(oradorService::convertirAOradorDto).toList();

        return new ResponseEntity<>(oradores, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody OradorDto orador) {
        if (orador.getApellido().isBlank() || orador.getNombre().isBlank() || orador.getTema().isBlank())
            return new ResponseEntity<>("No puede haber campos en blanco.", HttpStatus.BAD_REQUEST);

        oradorService.insertOrUpdate(new Orador(orador.getNombre(), orador.getApellido(), orador.getTema()));

        return new ResponseEntity<>("Orador agregado correctamente.", HttpStatus.OK);
    }

    @PutMapping("/edit")
    public ResponseEntity<String> edit(@RequestBody OradorDto orador) {
        if (orador.getApellido().isBlank() || orador.getNombre().isBlank() || orador.getTema().isBlank())
            return new ResponseEntity<>("No puede haber campos en blanco.", HttpStatus.BAD_REQUEST);

        oradorService.insertOrUpdate(oradorService.convertirAOrador(orador));

        return new ResponseEntity<>("Orador editado correctamente.", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") int id) {
        if (!oradorService.existsById(id))
            return new ResponseEntity<>("No se encontró el orador.", HttpStatus.BAD_REQUEST);

        oradorService.deleteById(id);

        return new ResponseEntity<>("Orador eliminado correctamente.", HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<OradorDto> detail(@PathVariable("id") int id) {
        Orador orador = oradorService.findById(id);

        if (orador != null)
            return new ResponseEntity<>(oradorService.convertirAOradorDto(orador), HttpStatus.OK);
        else
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
}