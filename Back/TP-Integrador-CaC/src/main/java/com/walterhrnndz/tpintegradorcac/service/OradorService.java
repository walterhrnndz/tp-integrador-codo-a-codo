package com.walterhrnndz.tpintegradorcac.service;

import com.walterhrnndz.tpintegradorcac.dto.OradorDto;
import com.walterhrnndz.tpintegradorcac.model.Orador;
import com.walterhrnndz.tpintegradorcac.repository.IOradorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OradorService {

    private final IOradorRepository oradorRepository;

    public List<Orador> getAll() {
        return oradorRepository.findAll();
    }

    public void insertOrUpdate(Orador orador) {
        oradorRepository.save(orador);
    }

    public void deleteById(long id) {
        oradorRepository.deleteById(id);
    }

    public Orador findByNombre(String nombre) {
        return oradorRepository.findByNombre(nombre);
    }

    public OradorDto convertirAOradorDto(Orador orador) {
        return new OradorDto(orador.getId(), orador.getNombre(), orador.getApellido(), orador.getTema());
    }

    public Orador convertirAOrador(OradorDto orador) {
        return new Orador(orador.getId(), orador.getNombre(), orador.getApellido(), orador.getTema());
    }

    public boolean existsById(long id) {
        return oradorRepository.existsById(id);
    }

    public Orador findById(long id) {
        return oradorRepository.findById(id).orElse(null);
    }
}