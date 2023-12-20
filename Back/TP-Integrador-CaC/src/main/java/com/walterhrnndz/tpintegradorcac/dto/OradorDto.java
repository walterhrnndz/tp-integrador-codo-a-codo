package com.walterhrnndz.tpintegradorcac.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OradorDto {
    private long id;
    private String nombre;
    private String apellido;
    private String tema;
}
