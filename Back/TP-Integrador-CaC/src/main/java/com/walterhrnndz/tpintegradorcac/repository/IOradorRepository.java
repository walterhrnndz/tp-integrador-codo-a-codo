package com.walterhrnndz.tpintegradorcac.repository;

import com.walterhrnndz.tpintegradorcac.model.Orador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IOradorRepository extends JpaRepository<Orador, Long> {
    Orador findByNombre(String nombre);
}