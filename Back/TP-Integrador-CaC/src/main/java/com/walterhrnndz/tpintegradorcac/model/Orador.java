package com.walterhrnndz.tpintegradorcac.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orador")
public class Orador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nombre;
    private String apellido;
    private String tema;

    public Orador(String nombre, String apellido, String tema) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.tema = tema;
    }
}